import axios from "axios";
import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Bg from "../assets/images/bg2.jpg";
import Logo from "../assets/images/filmcratebg.png";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignin = (e) => {
    e.preventDefault();

    // Reset the error state before making the API call
    setError("");

    axios
      .post("http://localhost:3001/users/login", { username, password })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        // Assuming the user data is returned in the response
        const user = response.data.user;
        setUser(user);
        // setIsLoading(false); // Set isLoading to false after the API call is completed
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
          toast.error(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <>
      <Toaster />
      <section className="min-h-screen flex flex-col md:flex-row bg-[#F6F7D3]">
        <div className="bg-[#F6F7D3] hidden lg:block w-full md:w-1/2 xl:w-2/3">
          <img
            src={Bg}
            alt="background"
            className="w-full h-full object-cover"
          ></img>
        </div>

        <div
          className="bg-[#F6F7D3] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 px-6 lg:px-16 xl:px-12
          flex items-center justify-center my-4"
        >
          <div className="w-full h-fit">
            <h1 className="text-5xl font-bold font-serif">Filmfolio</h1>

            <h1 className="text-4xl md:text-4xl font-bold leading-tight mt-10 mb-2 texts">
              LOGIN
            </h1>
            <h2 className="text-3xl md:text-3xl font-medium leading-tight texts">
              WELCOME TO THE WORLD OF MOVIES
            </h2>

            <form className="mt-6" action="#" method="POST">
              <div>
                <label className="block text-[#305973] text-3xl texts">
                  Username
                </label>
                <Input
                  type="username"
                  placeholder="Enter your username"
                  autoFocus
                  required
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="mt-5">
                <label className="block text-[#305973] text-3xl texts">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your Password"
                  minLength="6"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="text-right mt-2">
                <Link
                  to="/forgotPassword"
                  className="text-[#305973] text-2xl font-medium texts"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button text="LOGIN" onClick={handleSignin} />

              {/* <button
                className="w-full px-4 py-3 bg-[#F6F7D3] rounded-lg font-medium text-[#305973] flex items-center justify-center gap-2 mt-4 border border-[#305973]"
                onClick={() => {
                  navigate("/");
                }}
              >
                <FaUser className="text-xl" />
                <span>Continue as Guest</span>
              </button> */}
            </form>

            <hr className="my-6 border-[#305973] w-full"></hr>

            <p className="mt-8 text-2xl texts">
              Need an account?{" "}
              <Link
                to="/register"
                className="text-[#305973] text-2xl font-medium texts"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
