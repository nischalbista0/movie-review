import React from "react";
import { useNavigate } from "react-router-dom";

export const MovieLists = ({ setActiveTab, movie, setMovie }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => {
        // setActiveTab("movie details");
        // setMovie(movie.movieDetails);
        navigate(`/movie/${movie.movieId}`);
      }}
    >
      <div className="bg-gray-300 object-cover rounded-lg ">
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.movieDetails.poster_path}`}
          alt="movie-img"
          className="w-full h-full object-cover rounded-lg aspect-square"
        />
      </div>
      <p className="text-center py-1 mb-1 watchlistfonts text-[12px] md:text-sm font-semibold ">
        {movie.movieDetails.title}
      </p>
    </div>
  );
};
