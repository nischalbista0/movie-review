import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../../atoms/atoms";
import "./otherStyles.css";

export const TopRatedMoviesBody = ({ setActiveTab, setMovie }) => {
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const navigate = useNavigate();
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/movies/top_rated/")
      .then((response) => {
        const shuffledMovies = shuffleArray(response.data.results);
        setTopRatedMovies(shuffledMovies);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Shuffle the array of movies
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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
      {topRatedMovies && topRatedMovies.length > 0 ? (
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
              key={topRatedMovie.id} // Change key to use unique id
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
                alt={topRatedMovie.title}
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
