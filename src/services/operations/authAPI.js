import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  PROFILE_API,
  VERIFY_OTP_API,
} = endpoints

// ================ send Otp ================
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      if (!response?.data?.message) {
        throw new Error("Failed to send OTP");
      }

      toast.success(response.data.message); // ví dụ: "OTP sent to email"
      // Nếu đang ở trang verify rồi thì không cần navigate nữa
      if (navigate) navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR --> ", error);
      toast.error(error?.response?.data?.message || "Could not send OTP");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


export function verifyEmail(email, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Verifying...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", VERIFY_OTP_API, { email, otp });

      // API chỉ trả về message
      if (!response?.data?.message) {
        throw new Error("Unexpected response from server");
      }

      toast.success(response.data.message); // "User registered. OTP sent to email." hoặc "Email verified"
      navigate("/login"); // hoặc trang bạn muốn sau khi xác thực thành công
      return true;
    } catch (error) {
      console.log("VERIFY OTP ERROR --> ", error);
      toast.error(error?.response?.data?.message || "Verification failed");
      return false;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function signUp(email, username, password, fullName, phone, birthday, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        email,
        username,
        password,
        fullName,
        phone,
        birthday,
      });

      // Kiểm tra nếu có message thì coi như thành công
      if (!response?.data?.message) {
        throw new Error("Unexpected response from server");
      }

      toast.success(response.data.message); // "User registered. OTP sent to email."
      navigate("/verify-email");

      return true;
    } catch (error) {
      console.log("SIGNUP API ERROR --> ", error);
      toast.error(error?.response?.data?.message || "Signup Failed");
      return false;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}



// ================ Login ================
export function login(credentials, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      // --- Step 1: Login ---
      const response = await apiConnector("POST", LOGIN_API, credentials);

      if (!response?.data?.accessToken) {
        throw new Error(response?.data?.message || "Login failed");
      }

      const accessToken = response.data.accessToken;
      dispatch(setToken(accessToken));
      localStorage.setItem("accessToken", accessToken);

      toast.success("Login Successful");

      // --- Step 2: Get Profile ---
      const profileRes = await apiConnector("GET", PROFILE_API, null, {
        Authorization: `Bearer ${accessToken}`,
      });

      const adminProfile = profileRes.data?.profile; // <-- Lấy từ profile
      if (!adminProfile) {
        throw new Error("Failed to load profile");
      }

      const userImage =
          adminProfile.image ||
          `https://api.dicebear.com/5.x/initials/svg?seed=${
              adminProfile.username || adminProfile.email
          }`;

      const finalUser = { ...adminProfile, image: userImage };

      dispatch(setUser(finalUser));
      localStorage.setItem("user", JSON.stringify(finalUser));

      // --- Step 3: Navigate ---
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN ERROR.......", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}



// ================ get Password Reset Token ================
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESET PASS TOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESET PASS TOKEN ERROR............", error)
      toast.error(error.response?.data?.message)
      // toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ reset Password ================
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error(error.response?.data?.message)
      // toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


// ================ Logout ================
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("accessToken");
    //localStorage.removeItem("refreshToken");
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}