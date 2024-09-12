// App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAtom } from "jotai";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MainPage from "./pages/MainPage";
import AddReviewPage from "./pages/AddReviewPage";
import UpdateReviewPage from "./pages/UpdateReviewPage";
import AllReviews from "./pages/AllReviews";
import { isLoggedInAtom } from "./atoms/atoms";
import ChangePassword from "./pages/changePassword";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={isLoggedIn ? <MainPage /> : <Login />} />
        <Route path="/login" element={isLoggedIn ? <MainPage /> : <Login />} />
        <Route
          path="/register"
          element={isLoggedIn ? <MainPage /> : <Register />}
        />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/movies" element={isLoggedIn ? <MainPage /> : <Login />} />
        <Route
          path="/writeReviews"
          element={isLoggedIn ? <AddReviewPage /> : <Login />}
        />
        <Route
          path="/updateReview"
          element={isLoggedIn ? <UpdateReviewPage /> : <Login />}
        />
        <Route
          path="/allReviews"
          element={isLoggedIn ? <AllReviews /> : <Login />}
        />
        <Route path="/changePassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
