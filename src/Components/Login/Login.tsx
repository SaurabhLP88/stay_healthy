import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./Login.css";

interface LoginProps {
  setLoggedIn: (value: boolean) => void;
}

interface LoginForm {
  email: string;
  password: string;
  role: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  role?: string;
}

interface LoginResponse {
  authtoken: string;
  role: string;
  id: string;
  email?: string;
  name?: string;
}

function Login({ setLoggedIn }: LoginProps) {
  const navigate = useNavigate();
  const DOCTOR_EMAIL_DOMAIN = "@stayhealthy.com";

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  //console.log("Login.js Loaded");

  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      setLoggedIn(true);
      navigate("/");
    }
  }, [navigate, setLoggedIn]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const tempErrors: LoginErrors = {};

    /*if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email";
    }*/

    if (!formData.email) {
      tempErrors.email = formData.role === "Doctor"
        ? "Username is required"
        : "Email is required";
    } else if (
      formData.role !== "Doctor" &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      tempErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    }

    if (!formData.role) {
      tempErrors.role = "Please select your role";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const apiCallToLogin = async (data: LoginForm): Promise<LoginResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: LoginResponse & { error?: string; message?: string } =
        await response.json();

      if (response.ok && result.authtoken) {
        sessionStorage.setItem("auth-token", result.authtoken);
        return result;
      } else {
        alert(result.error || result.message || "Login failed");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let payload = { ...formData };
    if (formData.role === "Doctor") {
      payload.email = `${formData.email}${DOCTOR_EMAIL_DOMAIN}`;
    }

    const result = await apiCallToLogin(payload);
    if (result) {
      alert("Login successful!");

      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("role", result.role);
      sessionStorage.setItem("email", result.email || payload.email);
      sessionStorage.setItem("name", result.name || formData.email.split("@")[0]);

      if (result.role === "Doctor") {
        sessionStorage.setItem("doctorId", result.id);
        sessionStorage.removeItem("userId");
      } else {
        sessionStorage.setItem("userId", result.id);
        sessionStorage.removeItem("doctorId");
      }

      setLoggedIn(true);
      navigate("/");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto px-0 pt-0">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-semibold text-blue-600 tracking-wide">{!showForgot ? "Login" : "Forgot Password"}</h1>
        </div>

        {!showForgot ? (
          <>
            {/* Signup Link */}
            <div className="text-center text-sm mb-4">
              Are you a new member?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up Here
              </Link>
            </div>

            {/* Login Form */}
            <div className="pt-2">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Role Selection */}
                <div>
                  <label className="block font-semibold mb-1">Login as</label>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-gray-700">
                      <input
                        type="radio"
                        name="role"
                        value="Doctor"
                        checked={formData.role === "Doctor"}
                        onChange={handleChange}
                        className="accent-blue-600"
                      />
                      Doctor
                    </label>

                    <label className="flex items-center gap-2 text-gray-700">
                      <input
                        type="radio"
                        name="role"
                        value="Patient"
                        checked={formData.role === "Patient"}
                        onChange={handleChange}
                        className="accent-blue-600"
                      />
                      Patient
                    </label>
                  </div>

                  {errors.role && (
                    <span className="text-red-500 text-sm">{errors.role}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-semibold mb-1">
                    {formData.role === "Doctor" ? "Username" : "Email"}
                  </label>

                  <div className={`flex flex-col sm:flex-row ${
                    formData.role === "Doctor" ? "border border-gray-300 rounded-md overflow-hidden" : "items-center"
                  }`}>
                    <input
                      id="email"
                      type="text"
                      name="email"
                      placeholder={
                        formData.role === "Doctor"
                          ? "Enter username"
                          : "Enter your email"
                      }
                      value={formData.email}
                      onChange={handleChange}
                      className={`px-3 py-2 outline-none ${
                        formData.role === "Doctor" ? "flex-1" : "w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                      }`}
                    />

                    {/* Show domain suffix only for Doctor */}
                    {formData.role === "Doctor" && (
                      <span className="px-4 py-2 bg-gray-100 border-l border-gray-300 text-gray-700 text-md whitespace-nowrap text-center">
                        {DOCTOR_EMAIL_DOMAIN}
                      </span>
                    )}
                  </div>
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block font-semibold mb-1">Password</label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}                      
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password}</span>
                  )}
                </div>

                {/* Buttons */}

                <div className="flex items-center justify-between gap-3 pt-2">
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgot(true);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Forgot Password?
                  </button>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="reset"
                      onClick={() => setFormData({ email: "", password: "", role: "" })}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"                      
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Login
                    </button>
                  </div>

                </div>
                
              </form>
            </div>
          </>
        ) : (
          <>            

            {/* Forgot Password Form */}
            <div className="pt-2">
              <form className="space-y-4">
                <div>
                  <label htmlFor="forgotEmail" className="block font-semibold mb-1">Email</label>
                  <input
                    id="forgotEmail"
                    type="email"
                    name="forgotEmail"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgot(false);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Login Again?
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>

  );
}

export default Login;
