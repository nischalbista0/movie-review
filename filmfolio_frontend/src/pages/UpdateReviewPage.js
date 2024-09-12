import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const UpdateReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const location = useLocation();
  const movieDetails = location.state?.movieDetails;
  const reviewID = location.state?.reviewID;

  useEffect(() => {
    // Fetch the review data from the API and populate the form fields
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/movies/${movieDetails.id}/reviews/${reviewID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { rating, review } = response.data.data;
        setRating(rating);
        setReviewText(review);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviewData();
  }, [movieDetails.id, reviewID]);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const reviewData = {
        rating: rating,
        review: reviewText,
      };

      await axios.put(
        `http://localhost:3001/movies/${movieDetails.id}/reviews/${reviewID}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSubmitted(true);

      toast.success("Review updated successfully");

      window.location.href = "/movie/" + movieDetails.id;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative h-screen ">
      <Toaster />

      <div className="absolute top-3 left-3">
        <button
          className="bg-white p-3 rounded-full shadow-md"
          onClick={() => {
            window.history.back();
          }}
        >
          <svg
            xmlns="https://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-xl w-full mx-auto moviefonts">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 mt-2">
            Update Your Review
          </h2>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            {movieDetails.movie.title}
          </h2>{" "}
          {/* New title added */}
          <div className="flex  items-center mb-6">
            <span className="mr-2 font-normal">Rating :</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-7 h-7 cursor-pointer ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
                onClick={() => handleRatingClick(star)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2l2.76 6.39L22 9.3l-5 4.1 1.9 5.74L12 17.25l-4.9 3.89 1.9-5.75-5-4.1 7.24-0.92L12 2z"
                />
              </svg>
            ))}
          </div>
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-medium moviefonts mb-4">
              Your Review :
            </h3>
            <textarea
              id="reviewText"
              className="w-full text-xs sm:text-sm px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              value={reviewText}
              onChange={handleReviewChange}
            ></textarea>
          </div>
          {submitted ? (
            <p className="text-green-500 font-semibold mb-4">
              Review updated successfully!
            </p>
          ) : null}
        </div>
      </div>
      <div className="fixed bottom-3 right-3">
        <button
          className="floating-button bg-[#08BA0C] text-white rounded-[50%] p-3 sm:p-4 md:p-5"
          onClick={handleSubmit}
        >
          <svg
            xmlns="https://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-8 sm:h-8 md:h-10 md:w-10"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M9 16.17l-3.17-3.17L4 14.83l5 5 11-11-1.41-1.41L9 16.17z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpdateReviewPage;
