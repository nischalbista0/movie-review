import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReviewBody from "../components/MoviePage/ReviewBody";
import { UserContext } from "../context/UserContext";

export default function AllReviews() {
  const location = useLocation();
  // const movieDetails = location.state?.movieDetails;
  const [movieDetails, setMovieDetails] = useState(
    location.state?.movieDetails
  );
  const [reviews, setReviews] = useState([]);

  const { user } = useContext(UserContext);

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

  // Function to handle liking/unliking a review
  const handleLikeUnlike = async (reviewID, isLiked) => {
    try {
      const url = isLiked
        ? `http://localhost:3001/movies/${movieId}/reviews/${reviewID}/unlike`
        : `http://localhost:3001/movies/${movieId}/reviews/${reviewID}/like`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMovieDetails((prevMovieDetails) => {
        const updatedReviews = prevMovieDetails.data[0].topReviews.map(
          (review) => {
            if (review._id === reviewID) {
              return {
                ...review,
                likes: isLiked ? review.likes - 1 : review.likes + 1,
                isLiked: !isLiked,
              };
            }
            return review;
          }
        );

        return {
          ...prevMovieDetails,
          data: [
            {
              ...prevMovieDetails.data[0],
              topReviews: updatedReviews,
            },
          ],
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateReview = (reviewID) => {
    navigate("/updateReview", {
      state: {
        movieDetails: movieDetails.data?.[0],
        reviewID: reviewID,
      },
    });
  };

  const handleDeleteReview = async (reviewID) => {
    try {
      await axios.delete(
        `http://localhost:3001/movies/${movieId}/reviews/${reviewID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMovieDetails((prevMovieDetails) => {
        const updatedReviews = prevMovieDetails.data[0].topReviews.filter(
          (review) => review._id !== reviewID
        );

        return {
          ...prevMovieDetails,
          data: [
            {
              ...prevMovieDetails.data[0],
              topReviews: updatedReviews,
            },
          ],
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReaction = async (reviewID, reactionType) => {
    console.log(reactionType);

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
        // Remove reaction
        url = `http://localhost:3001/movies/${movieDetails.id}/reviews/${reviewID}/reactions`;
        method = "DELETE";
      } else {
        // Add reaction
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

      // Fetch the updated reviews and set them in the component state
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

  return (
    <div className="flex flex-col gap-4 px-10 py-8">
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

      {reviews.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm sm:text-base md:text-lg moviefonts">
            No reviews yet. Be the first one to write a review.
          </p>{" "}
        </div>
      ) : (
        reviews.data?.map((review) => (
          <ReviewBody
            key={review.id}
            user={review.user}
            review={review.review}
            reviewDetails={review}
            rating={review.rating}
            likes={review.likes}
            isLiked={review.isLiked}
            isUserLoggedIn={review.isUserLoggedIn}
            // onLikeUnlike={() => handleLikeUnlike(review._id, review.isLiked)}
            onReaction={(reaction) => handleReaction(review._id, reaction)}
            // onUpdateReview={() => handleUpdateReview(review._id)}
            // onDeleteReview={() => handleDeleteReview(review._id)}
          />
        ))
      )}
    </div>
  );
}
