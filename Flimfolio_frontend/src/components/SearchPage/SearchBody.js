import axios from "axios";
import React, { useContext, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Search from "../../assets/images/search.gif";
import { UserContext } from "../../context/UserContext";

export const SearchBody = ({ setActiveTab, setMovie }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=5e0fec3cefe51f558b339c37099d85f5&query=${query}`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <body className="bg-[#F6F7D3]">
      <div className="flex absolute left-10 right-0 mt-5 px-10">
        <div className="relative rounded-xl overflow-hidden bg-white w-full max-w-full mx-5">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <BiSearchAlt className="text-white w-5 h-5" />
          </span>
          <input
            className="pl-10 pr-4 py-2 w-full bg-[#305973] focus:outline-none text-white placeholder-white"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-screen sidefonts">
        {searchQuery ? (
          <div className="absolute top-20 text-xl text-[#305973] flex flex-col gap-2 w-full px-4 sm:pl-24 sm:pr-16">
            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <img src={Search} alt="search" className="w-[35vw]" />
                <p>No results found</p>
              </div>
            ) : (
              searchResults.map((result, index) => (
                <div
                  key={index}
                  className="cursor-pointer flex items-center gap-3 w-full h-[100px] bg-white p-6 rounded-xl mb-2"
                  onClick={() => {
                    if (user) {
                      setActiveTab("movie details");
                      setMovie(result);
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  <div className="mr-2">
                    <img
                      src={
                        result.poster_path == null
                          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
                          : `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                      }
                      alt="movie poster"
                      className="max-w-[60px] max-h-[80px] rounded-xl object-cover"
                    />
                  </div>
                  <div className="text-sm sm:text-lg">{result.title}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <img src={Search} alt="search" className="w-[35vw]" />
            <h1 className="text-xl text-[#305973]">
              Your searches will appear here
            </h1>
          </>
        )}
      </div>
    </body>
  );
};
