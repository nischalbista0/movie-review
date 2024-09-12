// api.js
import axios from "axios";

export const handleLikeUnlike = async (
  movieId,
  reviewID,
  isLiked,
  setReviews
) => {
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

    // Fetch the updated reviews and set them in the component state
    const updatedReviewsResponse = await axios.get(
      `http://localhost:3001/movies/${movieId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setReviews(updatedReviewsResponse.data);

    console.log("liked");
  } catch (error) {
    console.log(error);
  }
};
