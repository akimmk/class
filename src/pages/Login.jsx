import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../utils/api";

const Login = () => {
<<<<<<< HEAD
=======
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
>>>>>>> 2a8d13f (login integrated)
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
<<<<<<< HEAD
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);
      login(response);
      // Redirect based on the role returned from the backend
      navigate(response.role === "teacher" ? "/teacher" : "/");
    } catch (error) {
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
=======
    setLoading(true);
    try {
      const response = await fetch("http://10.139.27.89:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok && data.accessToken && data.refreshToken) {
        // Only login if we have both valid tokens
        login(username);
        console.log(data);
        // Store both tokens in localStorage for future authenticated requests
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate("/");
      } 
      // else {
      //   // Handle different types of error responses
      //   if (response.status === 401) {
      //     setError("Invalid username or password");
      //   } else if (response.status === 400) {
      //     setError(data.message || "Please check your input");
      //   } else if (response.status === 404) {
      //     setError("User not found");
      //   } else {
      //     setError(data.message || "An error occurred during login");
      //   }
      // }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
>>>>>>> 2a8d13f (login integrated)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-2xl shadow-xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello,</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">
            Hey, welcome back to your special place
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
                disabled={isLoading}
=======
                disabled={loading}
>>>>>>> 2a8d13f (login integrated)
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                disabled={isLoading}
=======
                disabled={loading}
>>>>>>> 2a8d13f (login integrated)
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                <span className="material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
<<<<<<< HEAD
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                disabled={isLoading}
=======
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
>>>>>>> 2a8d13f (login integrated)
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
              <span className="material-icons mr-2 text-red-500">error</span>
              {error}
            </div>
          )}

<<<<<<< HEAD
          <button
            type="submit"
            className="w-full px-4 py-3 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
=======
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
>>>>>>> 2a8d13f (login integrated)
        </form>
      </div>
    </div>
  );
};

export default Login;
