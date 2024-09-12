import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { UserContext } from "../../context/UserContext";
import "./otherStyles.css";
import { isLoggedInAtom } from "../../atoms/atoms";
import { useAtom } from "jotai";

export const PopularMoviesBody = ({ setActiveTab, setMovieId, setMovie }) => {
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [hoveredSlide, setHoveredSlide] = useState(null);

  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  // const handleMovieDetailsClick = ({}) => {
  //   setMovieId(popularMovies[hoveredSlide].id);
  //   setActiveTab("movie details");
  // };
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/movies/popular/", {})
      .then((response) => {
        setPopularMovies(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setSlidesPerView(6);
      } else if (window.innerWidth >= 1024) {
        setSlidesPerView(5);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(4);
      } else if (window.innerWidth >= 640) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(2);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSlideMouseEnter = (index) => {
    setHoveredSlide(index);
  };

  const handleSlideMouseLeave = () => {
    setHoveredSlide(null);
  };

  return (
    <div>
      {popularMovies && popularMovies.length > 0 ? ( // Add conditional check
        <Swiper
          slidesPerView={slidesPerView}
          centeredSlides={false}
          spaceBetween={25}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {popularMovies.map((popularMovie, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-col cursor-pointer"
              onMouseEnter={() => handleSlideMouseEnter(index)}
              onMouseLeave={handleSlideMouseLeave}
              onClick={() => {
                if (isLoggedIn) {
                  navigate(`/movie/${popularMovie.id}`);
                  setMovie(popularMovie);
                } else {
                  navigate("/login");
                }
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${popularMovie.backdrop_path}`}
                alt={popularMovie.text}
                className="bg-center aspect-square"
              />
              <div
                className={`absolute bg-[#0000009a] top-0 w-full h-full rounded-[10px] flex items-center justify-center text-white transition-opacity duration-300 ${
                  hoveredSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-center px-2 poppins font-medium text-[14px]">
                  {popularMovie.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex justify-center w-full">
          <div className="loader ease-linear rounded-full border-t-8 border-[#305973] h-32 w-32 animate-spin"></div>
        </div>
      )}
    </div>
  );
};
