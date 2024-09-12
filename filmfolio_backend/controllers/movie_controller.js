const axios = require("axios");
const Review = require("../models/Review");
const User = require("../models/User");
const natural = require("natural");
const TfIdf = natural.TfIdf;
const nlp = require("compromise");

const baseURLForImage = "https://image.tmdb.org/t/p/w500";
const apiKey = process.env.API_KEY;

// Controller to get trending movies
const getTrendingMovies = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Controller to get popular movies
const getPopularMovies = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Controller to get top rated movies
const getTopRatedMovies = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const userID = req.user ? req.user.id : null;
    const movieID = req.params.id;

    const userInfo = await User.findById(userID);

    const [
      movieResponse,
      castResponse,
      similarResponse,
      topReviewsResponse,
      allReviewsResponse,
    ] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${apiKey}`
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${apiKey}`
      ),
      Review.find({ movieID })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user"),
      Review.find({ movieID }).sort({ createdAt: -1 }).populate("user"),
    ]);

    const movieDetails = movieResponse.data;
    const castWithImageURL = castResponse.data.cast.map((cast) => ({
      ...cast,
      profile_path: cast.profile_path
        ? `${baseURLForImage}${cast.profile_path}`
        : null,
    }));

    const similarMovies = similarResponse.data.results.map((movie) => ({
      ...movie,
      poster_path: movie.poster_path
        ? `${baseURLForImage}${movie.poster_path}`
        : null,
    }));

    const movieWithImageURL = {
      ...movieDetails,
      poster_path: movieDetails.poster_path
        ? `${baseURLForImage}${movieDetails.poster_path}`
        : null,
      backdrop_path: movieDetails.backdrop_path
        ? `${baseURLForImage}${movieDetails.backdrop_path}`
        : null,
    };

    const likedReviews = userInfo
      ? await Review.find({
          _id: { $in: topReviewsResponse.map((review) => review._id) },
          likes: userInfo._id,
        })
      : [];

    const topReviewsWithExtraFields = topReviewsResponse.map((review) => ({
      ...review.toObject(),
      isLiked: likedReviews.some((likedReview) =>
        likedReview._id.equals(review._id)
      ),
      isUserLoggedIn: userInfo ? userInfo._id.equals(review.user._id) : false,
    }));

    let reviewSummary = "";
    if (allReviewsResponse.length >= 3) {
      const tfidf = new TfIdf();
      const adjectiveCounts = {}; // Object to keep track of adjective frequencies

      // Add each review to the TF-IDF instance, focusing on adjectives
      allReviewsResponse.forEach((review) => {
        // Extract adjectives using compromise
        const doc = nlp(review.review);
        const adjectives = doc.adjectives().out("array");

        // Add adjectives to the TF-IDF model and count their occurrences
        adjectives.forEach((adj) => {
          if (adj) {
            // Add adjective to TF-IDF instance
            tfidf.addDocument(adj);

            // Increment the count for the adjective
            adjectiveCounts[adj] = (adjectiveCounts[adj] || 0) + 1;
          }
        });
      });

      // Aggregate terms from all documents
      const aggregatedTerms = [];
      tfidf.documents.forEach((document, index) => {
        aggregatedTerms.push(
          ...tfidf
            .listTerms(index)
            .map((term) => ({ term: term.term, tfidf: term.tfidf }))
        );
      });

      // Aggregate and sort terms by their TF-IDF value
      const termCounts = aggregatedTerms.reduce((acc, term) => {
        acc[term.term] = (acc[term.term] || 0) + term.tfidf;
        return acc;
      }, {});

      // Convert termCounts to an array of { term, tfidf, count }
      const sortedTerms = Object.entries(termCounts)
        .map(([term, tfidf]) => ({
          term,
          tfidf,
          count: adjectiveCounts[term] || 0, // Include count of the adjective
        }))
        .sort((a, b) => b.tfidf - a.tfidf)
        .slice(0, 8);

      // Create review summary string with counts
      reviewSummary = sortedTerms
        .map((term) => `${term.term} (${term.count})`)
        .join(", ");
    }

    const isWatchListed = userInfo.watchlist.includes(movieID.toString());

    res.json({
      data: [
        {
          id: movieDetails.id,
          movie: movieWithImageURL,
          cast: castWithImageURL,
          similarMovies,
          topReviews: topReviewsWithExtraFields,
          isWatchListed,
          reviewSummary: reviewSummary,
        },
      ],
    });
  } catch (error) {
    res.json({ error: error.message });
    return;
  }
};

// Controller to search movies by name
const searchMoviesByName = async (req, res) => {
  try {
    const movieName = req.params.name;

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`
    );
    res.json(response.data);
  } catch (err) {
    res.json({ error: err.message });
    return;
  }
};

module.exports = {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getMovieDetails,
  searchMoviesByName,
};
