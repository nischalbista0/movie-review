import React from "react";
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import "../../index.css";
import { PopularMoviesBody } from "./PopularMoviesBody";
import { TopRatedMoviesBody } from "./TopRatedMoviesBody";
import { TrendingMoviesBody } from "./TrendingMovieBody";

export const MovieBody = ({
  setActiveTab,
  movieId,
  setMovieId,
  movie,
  setMovie,
}) => {
  return (
    <body>
      <TrendingMoviesBody
        setActiveTab={setActiveTab}
        movie={movie}
        setMovie={setMovie}
      />

      <div className="flex flex-col px-10 py-10 gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg sm:text-2xl font-semibold sidefonts text-[#305973]">
            TOP RATED IMDb MOVIES
          </h1>
          <TopRatedMoviesBody setActiveTab={setActiveTab} setMovie={setMovie} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold sidefonts text-[#305973]">
            POPULAR MOVIES
          </h1>
          <PopularMoviesBody
            setActiveTab={setActiveTab}
            movieId={movieId}
            setMovieId={setMovieId}
            setMovie={setMovie}
          />
        </div>
      </div>
    </body>
  );
};
