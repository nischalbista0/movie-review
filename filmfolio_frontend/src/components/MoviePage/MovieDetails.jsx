import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { CastBody } from "./CastBody";
import ReviewBody from "./ReviewBody";
import toast, { Toaster } from "react-hot-toast";

export const MovieDetails = () => {
  const { movieId } = useParams();
  const [showAllCast, setShowAllCast] = useState(false);
  const maxToShow = 8;

  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState({});
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [sortOption, setSortOption] = useState("highest");

  const sortReviews = (reviews) => {
    if (sortOption === "highest") {
      return reviews.sort((a, b) => b.rating - a.rating);
    }
    if (sortOption === "lowest") {
      return reviews.sort((a, b) => a.rating - b.rating);
    }
    return reviews;
  };

  const reviewSummary = movieDetails?.data?.[0]?.reviewSummary || "";

  // Convert the reviewSummary to an array if it exists
  const summaryArray = reviewSummary
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0); // Remove any empty strings

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setMovieDetails(response.data);
        setIsWatchlisted(response.data.data[0].isWatchListed); // Set watchlist status from response
        setLoading(false); // Data has been loaded, so stop loading
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [movieId]);

  // Function to handle adding/removing from watchlist
  const handleWatchlistToggle = async () => {
    try {
      if (isWatchlisted) {
        // Remove from watchlist
        await axios.delete(`http://localhost:3001/watchlist/${movieId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsWatchlisted(false);
      } else {
        // Add to watchlist
        await axios.post(
          `http://localhost:3001/watchlist/${movieId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsWatchlisted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleReaction = async (reviewID, userId, reactionType) => {
    if (!user.user || !user.user[0]._id) {
      console.error("User is not authenticated or user ID is missing");
      return;
    }

    try {
      const review = movieDetails.data[0].topReviews.find(
        (review) => review._id === reviewID
      );

      if (!review) {
        return;
      }

      // Check if the user has an existing reaction
      const existingReaction = Object.keys(review.reactions).find((key) =>
        review.reactions[key].includes(user.user[0]._id)
      );

      if (existingReaction) {
        // If the user already reacted, remove the old reaction
        await axios.delete(
          `http://localhost:3001/movies/${movieId}/reviews/${reviewID}/reactions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { reactionType: existingReaction },
          }
        );
      }

      // Add the new reaction
      await axios.post(
        `http://localhost:3001/movies/${movieId}/reviews/${reviewID}/reactions`,
        { reactionType: reactionType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the movie details in state
      setMovieDetails((prevMovieDetails) => {
        const updatedReviews = prevMovieDetails.data[0].topReviews.map(
          (review) => {
            if (review._id === reviewID) {
              const updatedReactions = { ...review.reactions };

              // Clear previous reaction if exists
              if (existingReaction) {
                updatedReactions[existingReaction] = updatedReactions[
                  existingReaction
                ].filter((userID) => userID !== user.user[0]._id);
                if (updatedReactions[existingReaction].length === 0) {
                  delete updatedReactions[existingReaction];
                }
              }

              // Add the new reaction
              if (!updatedReactions[reactionType]) {
                updatedReactions[reactionType] = [];
              }
              updatedReactions[reactionType].push(user.user[0]._id);

              return {
                ...review,
                reactions: updatedReactions,
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
      console.error("Error handling reaction:", error);
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

      toast.success("Review deleted successfully");

      setMovieDetails((prevMovieDetails) => {
        console.log(prevMovieDetails);
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

  // Add Review
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

      await axios.post(
        `http://localhost:3001/movies/${movieDetails.data?.[0].id}/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Reset the state after submitting the review (optional)
      setRating(0);
      setReviewText("");
      setSubmitted(true);

      toast.success("Review submitted successfully");

      window.location.href = "/movie/" + movieDetails.data?.[0].id;
    } catch (error) {
      // console.log(error.response.data);
      toast.error(error.response.data.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="loader ease-linear rounded-full border-t-8 border-[#305973] h-32 w-32 animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <img
        src={
          movieDetails.data?.[0]?.movie.backdrop_path == null
            ? "https://hips.hearstapps.com/hmg-prod/images/legacy-fre-image-placeholder-1641422577.png?crop=1.00xw:0.501xh;0,0.239xh&resize=1200:*"
            : `https://image.tmdb.org/t/p/w500/${movieDetails.data?.[0]?.movie.backdrop_path}`
        }
        alt=""
        className="object-cover h-[30vh] md:h-[50vh] w-full"
      />
      <div className="overlay absolute top-0 left-0 w-full h-[30vh] md:h-[50vh] bg-black opacity"></div>

      <div className="flex gap-7">
        <img
          src={
            movieDetails.data?.[0]?.movie.poster_path == null
              ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
              : `https://image.tmdb.org/t/p/w500/${movieDetails.data?.[0]?.movie.poster_path}`
          }
          alt=""
          className="relative rounded-xl object-cover bottom-10 sm:bottom-14 md:bottom-20 left-[5%] h-[15vh] sm:h-[20vh]  md:h-[30vh] w-[20vw] sm:w-[15vw] md:w-[20vw] max-w-[180px] "
        />

        <div className="ml-[2%] sm:ml-[5%] mt-4 md:mt-6 mr-[4%] moviefonts w-full flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex gap-2 sm:gap-5 justify-center items-center">
              <h1 className="text-[17px] sm:text-2xl font-semibold ">
                {movieDetails.data?.[0]?.movie.title}
              </h1>
              <span className="text-xs sm:text-base">
                {movieDetails.data?.[0]?.movie.release_date}
              </span>
            </div>

            {user?.user[0]?.userType !== "admin" && (
              <div>
                {isWatchlisted ? (
                  <FaBookmark
                    className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
                    onClick={handleWatchlistToggle}
                  />
                ) : (
                  <FaRegBookmark
                    className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
                    onClick={handleWatchlistToggle}
                  />
                )}
              </div>
            )}
          </div>
          <div>
            <p className="text-justify text-[12px] sm:text-[14px] md:text-base">
              {movieDetails.data?.[0]?.movie.overview}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col moviefonts ml-[16px] sm:ml-[60px] md:ml-[76px] gap-3">
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold">Cast</h1>
        <div className="flex flex-row flex-wrap gap-2">
          {showAllCast
            ? movieDetails.data?.[0]?.cast.map((cast) => (
                <CastBody key={cast.id} name={cast.name} />
              ))
            : movieDetails.data?.[0]?.cast
                .slice(0, maxToShow)
                .map((cast) => <CastBody key={cast.id} name={cast.name} />)}
          {movieDetails.data?.[0]?.cast.length > maxToShow && (
            <div
              className="rounded-md sm:rounded-lg  w-fit px-2 py-1 sm:px-2 sm:py-2 cursor-pointer"
              onClick={() => setShowAllCast((prev) => !prev)}
            >
              <h1 className="text-xs text-[#305973] sm:text-sm font-semibold">
                {showAllCast ? "See Less" : "See All"}
              </h1>
            </div>
          )}
        </div>
      </div>

      {summaryArray.length > 0 && (
        <div className="flex flex-col moviefonts mt-10 ml-[16px] sm:ml-[60px] md:ml-[76px] gap-4">
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
            Review Summary
          </h1>
          <div className="flex flex-wrap gap-3">
            {summaryArray.map((summary, index) => (
              <div
                key={index}
                className="bg-[#F0F4F8] text-[#305973] rounded-lg shadow-md px-4 py-2 transition-transform transform hover:scale-105"
              >
                <h2 className="text-sm md:text-base font-medium">{summary}</h2>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-center h-full">
          <div className="p-4 mt-8 rounded-xl shadow-lg bg-white mx-8 lg:mx-20 w-full moviefonts">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Share Your Review of{" "}
              <span className="text-[#305973]">
                {movieDetails.data?.[0].movie.title}
              </span>
              !
            </h2>

            <div className="flex  items-center mb-4">
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
            <button
              className="w-32 bg-[#305973] text-white font-medium rounded-md px-4 py-2 hover:bg-[#204d64] transition"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col moviefonts mt-10 ml-[16px] sm:ml-[60px] md:ml-[76px] gap-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
            Popular Reviews
          </h1>

          <select
            className="border rounded-md p-2 mr-4"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="highest">Highest to Lowest</option>
            <option value="lowest">Lowest to Highest</option>
          </select>
        </div>

        {movieDetails.data?.[0]?.topReviews.length === 0 ? (
          <p className="text-sm sm:text-base md:text-lg">
            No reviews yet. Be the first one to write a review.
          </p>
        ) : (
          sortReviews(movieDetails.data[0].topReviews).map((review) => (
            <ReviewBody
              key={review.id}
              user={review.user}
              review={review.review}
              reviewDetails={review}
              rating={review.rating}
              likes={review.likes}
              isLiked={review.isLiked}
              isUserLoggedIn={review.isUserLoggedIn}
              onLikeUnlike={() => handleLikeUnlike(review._id, review.isLiked)}
              onReaction={(reaction) =>
                handleReaction(review._id, user.user[0]._id, reaction)
              }
              onUpdateReview={() => handleUpdateReview(review._id)}
              onDeleteReview={() => handleDeleteReview(review._id)}
            />
          ))
        )}

        <div className="flex flex-col gap-3">
          <button
            className="text-sm sm:text-base md:text-lg"
            onClick={() => {
              navigate("/allReviews", {
                state: {
                  movieDetails: movieDetails.data?.[0],
                },
              });
            }}
          >
            All Reviews
          </button>
          <div className="border-b-[#305973] border-b-2 mb-2"></div>
        </div>
      </div>

      <div className="flex flex-col moviefonts mt-10 px-[32px] md:px-[60px] gap-3">
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold mb-2">
          Similar Movies
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:grid-cols-5">
          {movieDetails.data?.[0]?.similarMovies.slice(0, 10).map((movie) => (
            <div
              className="cursor-pointer rounded-md bg-gray-400"
              onClick={() => {
                navigate(`/movie/${movie.id}`);
              }}
              key={movie.id}
            >
              <img
                src={
                  movie.poster_path == null
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
                    : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                }
                alt=""
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
