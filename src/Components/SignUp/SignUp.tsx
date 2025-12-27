import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";
import initSpeciality from "../../utils/specialities";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUp.css";

interface SignUpProps {
  setLoggedIn?: (value: boolean) => void;
}

interface SignUpFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "Doctor" | "Patient" | "";
  speciality?: string;
  experience?: string;
}

type FormErrors = Partial<Record<keyof SignUpFormData, string>>;

function SignUp({ setLoggedIn }: SignUpProps) {
  const navigate = useNavigate();
  const DOCTOR_EMAIL_DOMAIN = "@stayhealthy.com";

  const initialFormState: SignUpFormData = {
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    speciality: "",
    experience: "",
  };

  const [formData, setFormData] = useState<SignUpFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [doctorUsername, setDoctorUsername] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setDoctorUsername("");
    setErrors({});
  };

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};

    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.phone) tempErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      tempErrors.phone = "Enter valid 10-digit phone";

    /*if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Enter a valid email";*/

    if (formData.role === "Doctor") {
      if (!formData.speciality)
        tempErrors.speciality = "Speciality is required";
      if (!formData.experience)
        tempErrors.experience = "Experience is required";
      if (!doctorUsername)
        tempErrors.email = "Doctor username is required";
      else if (!/^[a-zA-Z0-9._]+$/.test(doctorUsername))
        tempErrors.email = "Only letters, numbers, dot and underscore allowed";
    } else {
      if (!formData.email)
        tempErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        tempErrors.email = "Enter a valid email";
    }

    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    if (!formData.role) tempErrors.role = "Please select your role";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const apiCallToRegister = async (data: SignUpFormData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.authtoken) {
        sessionStorage.setItem("auth-token", result.authtoken);
        return result;
      } else {
        alert(result.error || result.message || "Registration failed");
        return null;
      }
    } catch (error) {
      console.error("Signup error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const finalFormData = {
      ...formData,
      email:
        formData.role === "Doctor"
          ? `${doctorUsername}${DOCTOR_EMAIL_DOMAIN}`
          : formData.email,
    };

    const result = await apiCallToRegister(finalFormData);
    if (result) {
      alert("Registration successful! Please login.");
      setFormData(initialFormState);
      sessionStorage.clear();
      setLoggedIn?.(false);
      navigate("/login");
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
          <h1 className="text-3xl font-semibold text-blue-600 tracking-wide">Sign Up</h1>
        </div>

        {/* Login link */}
        <div className="text-center text-sm mb-4">
          Already a member?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </div>

        <div className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Register as */}
            <div>
              <label className="block font-semibold mb-1">Register as</label>

              <div className="flex items-center gap-6">
                <label htmlFor="doctorRadio" className="flex items-center gap-2 text-gray-700">
                  <input
                    id="doctorRadio"
                    type="radio"
                    name="role"
                    value="Doctor"
                    checked={formData.role === "Doctor"}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  Doctor
                </label>

                <label htmlFor="patientRadio" className="flex items-center gap-2 text-gray-700">
                  <input
                    id="patientRadio"
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

            {/* Name */}
            <div>
              <label htmlFor="name" className="block font-semibold mb-1">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Doctor-only fields */}
            {formData.role === "Doctor" && (
              <>
                {/* Speciality */}
                <div>
                  <label htmlFor="speciality" className="block font-semibold mb-1">Speciality</label>
                  <select
                    id="speciality"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="">Select speciality</option>
                    {initSpeciality.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </select>

                  {errors.speciality && (
                    <span className="text-red-500 text-sm">
                      {errors.speciality}
                    </span>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block font-semibold mb-1">Experience (in years)</label>
                  <input
                    id="experience"
                    type="number"
                    name="experience"
                    min="0"
                    placeholder="Enter years of experience"
                    value={formData.experience || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {errors.experience && (
                    <span className="text-red-500 text-sm">{errors.experience}</span>
                  )}
                </div>
              </>
            )}

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block font-semibold mb-1">Phone</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">Email</label>

              {/*<input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              />*/}

              {formData.role === "Doctor" ? (
                /* Doctor Email (username + fixed domain) */
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="username"
                    value={doctorUsername}
                    onChange={(e) => setDoctorUsername(e.target.value)}
                    className="flex-1 px-3 py-2 outline-none"
                  />
                  <span className="px-4 py-2 bg-gray-100 border-l border-gray-300 text-gray-700 text-md whitespace-nowrap">
                    {DOCTOR_EMAIL_DOMAIN}
                  </span>
                </div>
              ) : (
                /* Patient Email (normal) */
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600"
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
            <div className="flex items-center justify-end gap-3 pt-2 pb-4">
              

              <button
                type="reset"
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reset
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>

  );
}

export default SignUp;
