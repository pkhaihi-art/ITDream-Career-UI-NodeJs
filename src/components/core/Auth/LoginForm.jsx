import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"
import Tab from "../../common/Tab"

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // role (grantType)
  const [grantType, setGrantType] = useState("student");

  // giữ chung value để tái sử dụng
  const [accountValue, setAccountValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    // nếu admin thì dùng username, ngược lại dùng email
    const payload =
        grantType === "admin"
            ? { username: accountValue, password }
            : { email: accountValue, password };

    dispatch(login(grantType, payload, navigate));
  };

  const tabData = [
    { id: 1, tabName: "Admin", type: "admin" },
    { id: 2, tabName: "Educator", type: "educator" },
    { id: 3, tabName: "Student", type: "student" },
  ];

  return (
      <form
          onSubmit={handleOnSubmit}
          className="mt-6 flex w-full flex-col gap-y-4"
      >
        {/* Tabs chọn role */}
        <Tab tabData={tabData} field={grantType} setField={setGrantType} />

        {/* Username / Email */}
        <label className="w-full">
          <p className="mb-1 text-sm text-richblack-5">
            {grantType === "admin" ? "Username" : "Email Address"}{" "}
            <sup className="text-pink-200">*</sup>
          </p>
          <input
              required
              type={grantType === "admin" ? "text" : "email"}
              name={grantType === "admin" ? "username" : "email"}
              value={accountValue}
              onChange={(e) => setAccountValue(e.target.value)}
              placeholder={
                grantType === "admin"
                    ? "Enter username"
                    : "Enter email address"
              }
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
  );
}

export default LoginForm;
