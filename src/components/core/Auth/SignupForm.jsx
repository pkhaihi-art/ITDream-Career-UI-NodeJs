import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import {signUp} from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { fullName, username, email, phone, birthday, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = { email, username, password, fullName, phone, birthday };

    dispatch(setSignupData(signupData));

    const result = await dispatch(
        signUp(email, username, password, fullName, phone, birthday, navigate)
    );

    if (result) {
      console.log("User registered, OTP sent.");
    }

    setFormData({
      fullName: "",
      username: "",
      email: "",
      phone: "",
      birthday: "",
      password: "",
      confirmPassword: "",
    });
  };


  return (
      <div>
        <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
          {/* Full Name */}
          <label>
            <p className="mb-1 text-sm text-richblack-5">
              Full Name <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type="text"
                name="fullName"
                value={fullName}
                onChange={handleOnChange}
                placeholder="Enter full name"
                className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 outline-none"
            />
          </label>

          {/* Username */}
          <label>
            <p className="mb-1 text-sm text-richblack-5">
              Username <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type="text"
                name="username"
                value={username}
                onChange={handleOnChange}
                placeholder="Enter username"
                className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 outline-none"
            />
          </label>

          {/* Email */}
          <label>
            <p className="mb-1 text-sm text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 outline-none"
            />
          </label>

          {/* Phone */}
          <label>
            <p className="mb-1 text-sm text-richblack-5">
              Phone Number <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type="tel"
                name="phone"
                value={phone}
                onChange={handleOnChange}
                placeholder="Enter phone number"
                className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 outline-none"
            />
          </label>

          {/* Birthday */}
          <label>
            <p className="mb-1 text-sm text-richblack-5">
              Birthday <sup className="text-pink-200">*</sup>
            </p>
            <input
                required
                type="date"
                name="birthday"
                value={birthday}
                onChange={handleOnChange}
                className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 outline-none"
            />
          </label>

          <div className="flex gap-x-4">
            {/* Password */}
            <label className="relative w-full">
              <p className="mb-1 text-sm text-richblack-5">
                Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Enter password"
                  className="w-full rounded-md bg-richblack-800 p-3 pr-10 text-richblack-5 outline-none"
              />
              <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] cursor-pointer"
              >
              {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            </label>

            {/* Confirm Password */}
            <label className="relative w-full">
              <p className="mb-1 text-sm text-richblack-5">
                Confirm Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm password"
                  className="w-full rounded-md bg-richblack-800 p-3 pr-10 text-richblack-5 outline-none"
              />
              <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] cursor-pointer"
              >
              {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            </label>
          </div>

          <button
              type="submit"
              className="mt-6 rounded-lg bg-yellow-50 py-2 px-4 font-medium text-richblack-900"
          >
            Create Account
          </button>
        </form>
      </div>
  )
}

export default SignupForm
