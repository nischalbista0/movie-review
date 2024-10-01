import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewBody from "../components/MoviePage/ReviewBody";
import { UserContext } from "../context/UserContext";
import toast, { Toaster } from "react-hot-toast";

export default function AllReviews() {
  const location = useLocation();
  const [movieDetails, setMovieDetails] = useState(
    location.state?.movieDetails
  );
  const [reviews, setReviews] = useState({ data: [] }); // Initialize reviews as an object with an empty data array
  const [sortOrder, setSortOrder] = useState("highest"); // Default sort order

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/movies/${movieDetails.id}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUpdateReview = (reviewID) => {
    navigate("/updateReview", {
      state: {
        movieDetails: movieDetails,
        reviewID: reviewID,
      },
    });
  };

  const handleDeleteReview = async (reviewID) => {
    const movieId = movieDetails.id;
    try {
      await axios.delete(
        `http://localhost:3001/movies/${movieId}/reviews/${reviewID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Review deleted successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReaction = async (reviewID, reactionType) => {
    if (!user.user || !user.user[0]._id) {
      console.error("User is not authenticated or user ID is missing");
      return;
    }

    try {
      const review = reviews.data.find((review) => review._id === reviewID);
      if (!review) {
        console.error("Review not found");
        return;
      }

      const userReactionExists = review.reactions[reactionType]?.includes(
        user.user[0]._id
      );

      let url;
      let method;

      if (userReactionExists) {
        url = `http://localhost:3001/movies/${movieDetails.id}/reviews/${reviewID}/reactions`;
        method = "DELETE";
      } else {
        url = `http://localhost:3001/movies/${movieDetails.id}/reviews/${reviewID}/reactions`;
        method = "POST";
      }

      await axios({
        method: method,
        url: url,
        data: { reactionType: reactionType },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedReviewsResponse = await axios.get(
        `http://localhost:3001/movies/${movieDetails.id}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews(updatedReviewsResponse.data);
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  // Handle sort order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Sorting logic based on sortOrder
  const sortedReviews = reviews.data?.sort((a, b) => {
    if (sortOrder === "highest") {
      return b.rating - a.rating;
    } else if (sortOrder === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-4 px-10 py-8">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex items-center mb-3">
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
      </div>

      <div className="w-full flex items-center justify-end mb-4">
        <label htmlFor="sortReviews" className="mr-2 text-sm font-medium">
          Sort reviews by:
        </label>
        <select
          id="sortReviews"
          className="p-2 border rounded"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="highest">Highest to Lowest</option>
          <option value="lowest">Lowest to Highest</option>
        </select>
      </div>

      {reviews.data && reviews.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm sm:text-base md:text-lg moviefonts">
            No reviews yet. Be the first one to write a review.
          </p>
        </div>
      ) : (
        sortedReviews?.map((review) => (
          <ReviewBody
            key={review.id}
            user={review.user}
            review={review.review}
            reviewDetails={review}
            rating={review.rating}
            likes={review.likes}
            isLiked={review.isLiked}
            isUserLoggedIn={review.isUserLoggedIn}
            onReaction={(reaction) => handleReaction(review._id, reaction)}
            onUpdateReview={() => handleUpdateReview(review._id)}
            onDeleteReview={() => handleDeleteReview(review._id)}
          />
        ))
      )}
    </div>
  );
}
