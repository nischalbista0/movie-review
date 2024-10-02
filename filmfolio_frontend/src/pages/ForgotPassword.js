import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Bg from "../assets/images/bg2.jpg";
import Logo from "../assets/images/filmcratebg.png";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [password, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleSendToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/users/password-recovery/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        setSuccessMessage("Token sent successfully!");
        setError(null);
        setToken("");
        toast.success("Token sent successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to send token");
        setSuccessMessage(null);
        toast.error(errorData.error || "Failed to send token");
      }
    } catch (error) {
      console.error("Token sending error:", error);
      setError("An unexpected error occurred");
      setSuccessMessage(null);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/users/password-recovery/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, token }),
        }
      );
      if (response.ok) {
        setSuccessMessage("Password recovery successful!");
        setError(null);
        toast.success("Password recovery successful!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to recover password");
        setSuccessMessage(null);
        toast.error(errorData.error || "Failed to recover password");
      }
    } catch (error) {
      console.error("Password recovery error:", error);
      setError("An unexpected error occurred");
      setSuccessMessage(null);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
          />
        </div>
        <div className="bg-[#F6F7D3] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 px-6 lg:px-16 xl:px-12 flex items-center justify-center my-4">
          <div className="w-full h-100">
            <h1 className="text-5xl font-bold font-serif py-10">Filmfolio</h1>

            <h1 className="text-4xl md:text-4xl font-bold leading-tight mt-3 mb-2 texts">
              Forgot Password?
            </h1>
            <h2 className="text-3xl md:text-3xl font-medium leading-tight texts">
              Recover your password
            </h2>

            <form className="mt-3 bg-[#F6F7D3]" action="#" method="POST">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[#305973] text-3xl texts">
                    Email
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    autoFocus
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>

                {token === null ? (
                  <Button
                    text="Send Token"
                    onClick={handleSendToken}
                    disabled={loading}
                  />
                ) : (
                  <div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[#305973] text-3xl texts">
                          Token
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter the token from your email"
                          required
                          value={token}
                          onChange={handleTokenChange}
                        />
                      </div>

                      <div>
                        <label className="block text-[#305973] text-3xl texts">
                          New Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          autoFocus
                          required
                          value={password}
                          onChange={handleNewPasswordChange}
                        />
                      </div>
                    </div>

                    <Button
                      text="Recover Password"
                      onClick={handleCheckToken}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
