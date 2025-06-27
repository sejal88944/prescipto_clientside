import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      const endpoint = mode === "signup" ? "register" : "login";
      const { data } = await axios.post(`${backendUrl}/api/user/${endpoint}`, 
        mode === "signup" ? formData : {
          email: formData.email,
          password: formData.password
        }
      );
      
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(`Successfully ${mode === "signup" ? "registered" : "logged in"}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {mode === "signup" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {mode === "signup" ? "sign up" : "log in"} to book appointment
        </p>
        
        {mode === "signup" && (
          <div className="w-full">
            <label htmlFor="name">Full Name</label>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>
        
        <div className="w-full relative">
          <label htmlFor="password">Password</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
            minLength={6}
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-xs"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50"
          disabled={loading.profile}
        >
          {loading.profile ? "Processing..." : mode === "signup" ? "Create Account" : "Login"}
        </button>
        
        <p>
          {mode === "signup" 
            ? "Already have an account? "
            : "Create a new account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-primary underline cursor-pointer bg-transparent border-none"
          >
            {mode === "signup" ? "Login here" : "click here"}
          </button>
        </p>
      </div>
    </form>
  );
};

export default Login;