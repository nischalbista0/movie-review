import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import Slider3 from "../../assets/images/angrymen.jpg";
import Slider1 from "../../assets/images/banshees.jpg";
import Slider2 from "../../assets/images/godfather.jpg";
import Slider4 from "../../assets/images/john.jpg";
import Slider5 from "../../assets/images/shawshank.jpg";
import "./otherStyles.css";

export const OtherMovies = ({setActiveTab}) => {
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [hoveredSlide, setHoveredSlide] = useState(null);

  const handleMovieDetailsClick = () => {
    setActiveTab("movie details");
  };

  const slideData = [
    { image: Slider1, text: "Slide 1 adsh kadsh kadshk adhda " },
    { image: Slider2, text: "Slide 2" },
    { image: Slider3, text: "Slide 3" },
    { image: Slider4, text: "Slide 4" },
    { image: Slider5, text: "Slide 5" },
    { image: Slider1, text: "Slide 6" },
    { image: Slider4, text: "Slide 4" },
    { image: Slider5, text: "Slide 5" },
    { image: Slider1, text: "Slide 6" },
  ];

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
    <div className="h-[25vh]">
      <Swiper
        slidesPerView={slidesPerView}
        centeredSlides={false}
        spaceBetween={25}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {slideData.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col cursor-pointer"
            onMouseEnter={() => handleSlideMouseEnter(index)}
            onMouseLeave={handleSlideMouseLeave}
            onClick={handleMovieDetailsClick}
          >
            <img src={slide.image} alt={slide.text} className="bg-center" />
            <div
              className={`absolute bg-[#0000009a] top-0 w-full h-full rounded-[10px] flex items-center justify-center text-white transition-opacity duration-300 ${
                hoveredSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-center px-2 poppins font-medium text-[14px]">{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
