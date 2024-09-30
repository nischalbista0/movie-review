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
  const [isWatchlisted, setIsWatchlisted] = useState(false); // New state to track watchlist status
  const [loading, setLoading] = useState(true); // New state to track loading
  const { user } = useContext(UserContext);

  const reviewSummary = movieDetails?.data?.[0]?.reviewSummary || "";

  console.log(reviewSummary);

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

      const userReactionExists = review.reactions[reactionType]?.includes(
        user.user[0]._id
      );

      let url;
      let method;

      if (userReactionExists) {
        url = `http://localhost:3001/movies/${movieId}/reviews/${reviewID}/reactions`;
        method = "DELETE";
      } else {
        url = `http://localhost:3001/movies/${movieId}/reviews/${reviewID}/reactions`;
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

      setMovieDetails((prevMovieDetails) => {
        const updatedReviews = prevMovieDetails.data[0].topReviews.map(
          (review) => {
            if (review._id === reviewID) {
              const updatedReactions = { ...review.reactions };

              if (userReactionExists) {
                updatedReactions[reactionType] = updatedReactions[
                  reactionType
                ].filter((userID) => userID !== user.user[0]._id);

                if (updatedReactions[reactionType].length === 0) {
                  delete updatedReactions[reactionType];
                }
              } else {
                if (!updatedReactions[reactionType]) {
                  updatedReactions[reactionType] = [];
                }
                updatedReactions[reactionType].push(user.user[0]._id);
              }

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

      <div className="flex flex-col moviefonts mt-10 ml-[16px] sm:ml-[60px] md:ml-[76px] gap-3">
        <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
          Popular Reviews
        </h1>

        {/* show top movies but if there are not any then show text */}

        {movieDetails.data?.[0]?.topReviews.length === 0 ? (
          <p className="text-sm sm:text-base md:text-lg">
            No reviews yet. Be the first one to write a review.
          </p>
        ) : (
          movieDetails.data?.[0]?.topReviews
            .sort((a, b) => b.rating - a.rating)
            .map((review) => (
              <ReviewBody
                key={review.id}
                user={review.user}
                review={review.review}
                reviewDetails={review}
                rating={review.rating}
                likes={review.likes}
                isLiked={review.isLiked}
                isUserLoggedIn={review.isUserLoggedIn}
                onLikeUnlike={() =>
                  handleLikeUnlike(review._id, review.isLiked)
                }
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

        {user?.user[0]?.userType !== "admin" && (
          <div>
            <div className="fixed bottom-3 right-3">
              <button
                className="floating-button bg-[#08BA0C] text-white rounded-[50%] p-3 sm:p-4 md:p-6"
                onClick={() => {
                  navigate("/writeReviews", {
                    state: {
                      movieDetails: movieDetails.data?.[0],
                    },
                  });
                }}
              >
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 md:w-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M11.883 3.007L12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
