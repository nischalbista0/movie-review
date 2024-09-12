import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import Navigation styles
import { Pagination, Navigation } from "swiper/modules";

import { UserContext } from "../../context/UserContext";
import { TrendingMovie } from "./TrendingMovie";
import "./trendingStyles.css";
import { isLoggedInAtom } from "../../atoms/atoms";
import { useAtom } from "jotai";

const TrendingMoviesBody = ({
  setActiveTab,
  movie,
  setMovie,
  movieDetails,
  setMovieDetails,
}) => {
  // const { user } = useContext(UserContext);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/movies/trending/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setTrendingMovies(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(trendingMovies);

  return (
    <div className="relative flex items-center h-[40vh] justify-center md:h-[100vh] cursor-pointer">
      {trendingMovies && trendingMovies.length > 0 ? ( // Add conditional check
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Pagination, Navigation]} // Include Navigation module
          className="mySwipers"
        >
          {trendingMovies.map((movieData) => (
            <SwiperSlide key={movieData.id} className="swiper-slide relative">
              <TrendingMovie
                imageUrl={movieData.backdrop_path}
                movieName={movieData.title}
                movieDetails={movieDetails}
                setMovieDetails={setMovieDetails}
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(`/movie/${movieData.id}`);
                    setMovie(movieData);
                  } else {
                    navigate("/login");
                  }
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex justify-center w-full">
          <div className="loader ease-linear rounded-full border-t-8 border-[#305973] h-32 w-32 animate-spin"></div>
        </div>
      )}
      {/* Optional custom navigation buttons */}
      <div className="swiper-button-next"></div>
      <div className="swiper-button-prev"></div>
    </div>
  );
};

export { TrendingMoviesBody };
