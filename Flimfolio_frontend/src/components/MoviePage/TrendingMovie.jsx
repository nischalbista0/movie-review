import React from "react";
import { BiDetail } from "react-icons/bi";

const TrendingMovie = ({ imageUrl, movieName, onClick }) => {
  return (
    <>
      <img
        src={`https://image.tmdb.org/t/p/w500/${imageUrl}`}
        alt="Slide 1"
        className="bg-center"
      />

      <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity"></div>

      <h1 className="absolute text-white top-6 sm:top-7 left-20 text-xl md:text-2xl font-bold md:left-28">
        TRENDING MOVIES
      </h1>

      <div className="flex flex-col text-white absolute left-[27%] text-center">
        <div className="relative right-[12%] md:right-[18%] flex flex-col gap-1 md:gap-2 mt-2 md:mt-0">
          <h1 className="text-[1rem] sm:text-[1.5rem] text-start font-bold sidefonts md:text-[2.36rem]">
            {movieName}
          </h1>
          <div className="mt-4 flex items-center gap-4 md:gap-3">
            <button
              onClick={onClick}
              className="bg-[#F6F7D3] text-[#305973] py-2 px-3 md:px-4 rounded-lg flex items-center gap-2 text-[12px] md:text-[20px] font-bold"
            >
              <BiDetail className="w-4 h-4 md:w-6 md:h-6" />
              Details
            </button>
            {/* <button className="bg-[#F6F7D3] text-[#305973] py-2 px-3 md:px-4 rounded-lg flex items-center gap-2 text-[12px] md:text-[20px] font-bold">
              <BiPlayCircle className="w-4 h-4 md:w-6 md:h-6" />
              Trailer
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export { TrendingMovie };
