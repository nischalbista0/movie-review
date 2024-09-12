import React, { useContext, useEffect, useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import { MovieBody } from "../components/MoviePage/MovieBody";
import { MovieDetails } from "../components/MoviePage/MovieDetails";
import { ProfileBody } from "../components/ProfilePage/ProfileBody";
import { SearchBody } from "../components/SearchPage/SearchBody";
import { WatchlistBody } from "../components/WatchlistPage/WatchlistBody";
import Sidebar from "../components/common/Sidebar";
import { UserContext } from "../context/UserContext";
import { Outlet, Route, Routes } from "react-router-dom";

export default function MovieScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("movies");
  const [movieId, setMovieId] = useState(null);
  const [movie, setMovie] = useState(null);
  const { user } = useContext(UserContext);

  console.log(user);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (user?.user[0]?.userType === "admin") {
      setActiveTab("dashboard");
    }
  }, [user]);

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            index
            element={
              <MovieBody
                setActiveTab={handleTabChange}
                movieId={movieId}
                setMovieId={setMovieId}
                movie={movie}
                setMovie={setMovie}
              />
            }
          />
          <Route
            path="search"
            element={
              <SearchBody setActiveTab={setActiveTab} setMovie={setMovie} />
            }
          />
          <Route
            path="watchlist"
            element={
              <WatchlistBody
                setActiveTab={handleTabChange}
                setMovie={setMovie}
              />
            }
          />
          <Route path="profile" element={<ProfileBody />} />
          <Route
            path="movie/:movieId"
            element={
              <MovieDetails
                movieId={movieId}
                movie={movie}
                setActiveTab={setActiveTab}
                setMovie={setMovie}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}
