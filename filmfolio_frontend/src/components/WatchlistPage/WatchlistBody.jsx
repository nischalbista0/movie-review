import axios from "axios";
import React, { useEffect, useState } from "react";
import { MovieLists } from "./movielists";

export const WatchlistBody = ({ setActiveTab, setMovie }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/watchlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setWatchlist(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="absolute md:left-[6%] sm:left-[14%] left-[20%] top-6">
        <h1 className="text-2xl font-semibold sidefonts text-[#305973]">
          WATCHLIST
        </h1>
      </div>

      <div className=" md:px-24 px-10 mt-24">
        {watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold sidefonts text-[#305973]">
              Your watchlist is empty 🍿
            </h1>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-14 gap-3">
          {watchlist.map((movie) => (
            <MovieLists
              key={movie.id}
              setActiveTab={setActiveTab}
              movie={movie}
              setMovie={setMovie}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
