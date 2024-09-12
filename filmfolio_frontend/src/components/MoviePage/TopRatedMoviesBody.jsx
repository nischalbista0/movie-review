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
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../../atoms/atoms";

export const TopRatedMoviesBody = ({ setActiveTab, setMovie }) => {
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  // const { user } = useContext(UserContext);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  const navigate = useNavigate();

  // const handleMovieDetailsClick = () => {
  //   setActiveTab("movie details");
  // };

  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/movies/top_rated/", {})
      .then((response) => {
        setTopRatedMovies(response.data.results);
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
      {topRatedMovies && topRatedMovies.length > 0 ? ( // Add conditional check
        <Swiper
          slidesPerView={slidesPerView}
          centeredSlides={false}
          spaceBetween={25}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {topRatedMovies.map((topRatedMovie, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-col cursor-pointer"
              onMouseEnter={() => handleSlideMouseEnter(index)}
              onMouseLeave={handleSlideMouseLeave}
              onClick={() => {
                if (isLoggedIn) {
                  navigate(`/movie/${topRatedMovie.id}`);
                  setMovie(topRatedMovie);
                } else {
                  navigate("/login");
                }
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${topRatedMovie.backdrop_path}`}
                alt={topRatedMovie.text}
                className="bg-center aspect-square"
              />
              <div
                className={`absolute bg-[#0000009a] top-0 w-full h-full rounded-[10px] flex items-center justify-center text-white transition-opacity duration-300 ${
                  hoveredSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-center px-2 poppins font-medium text-[10px] sm:text-[14px]">
                  {topRatedMovie.title}
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
