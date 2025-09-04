import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleOnSubmit = (e) => {
    e.preventDefault()

    const payload = { email, password }
    dispatch(login(payload, navigate))
  }

  return (
      <form
          onSubmit={handleOnSubmit}
          className="mt-6 flex w-full flex-col gap-y-4"
      >
        {/* Email */}
        <label className="w-full">
          <p className="mb-1 text-sm text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5 outline-none"
          />
        </label>

        {/* Password */}
        <label className="relative">
          <p className="mb-1 text-sm text-richblack-5">
            Password <sup className="text-pink-200">*</sup>
          </p>
          <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full rounded-md bg-richblack-800 p-3 pr-12 text-richblack-5 outline-none"
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
          <Link to="/forgot-password">
            <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
              Forgot Password
            </p>
          </Link>
        </label>

        {/* Submit */}
        <button
            type="submit"
            className="mt-6 rounded-[8px] bg-yellow-50 py-2 px-3 font-medium text-richblack-900"
        >
          Sign In
        </button>
      </form>
  )
}

export default LoginForm
