import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const {
  SENDOTP_API,
  SIGNUP_STUDENT_API,
  SIGNUP_EDUCATOR_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  PROFILE_API,
  VERIFY_OTP_API,
  RESEND_OTP_API,
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

export function signUp(email, username, password, fullName, phone, birthday, userType, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      // Chọn endpoint dựa trên loại người dùng
      const signupEndpoint = userType === 'educator' ? SIGNUP_EDUCATOR_API : SIGNUP_STUDENT_API;
      
      const response = await apiConnector("POST", signupEndpoint, {
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
      // Chuẩn bị payload dựa trên grantType
      let loginPayload;
      if (credentials.grantType === 'admin') {
        loginPayload = {
          grantType: credentials.grantType,
          username: credentials.email, // email field chứa username cho admin
          password: credentials.password
        };
      } else {
        loginPayload = {
          grantType: credentials.grantType,
          email: credentials.email,
          password: credentials.password
        };
      }
      
      const response = await apiConnector("POST", LOGIN_API, loginPayload);

      if (!response?.data?.accessToken) {
        throw new Error(response?.data?.message || "Login failed");
      }

      const accessToken = response.data.accessToken;
      const userType = response.data.userType; // API trả về userType
      dispatch(setToken(accessToken));
      localStorage.setItem("accessToken", accessToken);

      toast.success("Login Successful");

      // --- Step 2: Get Profile based on user type ---
      let profileEndpoint;
      switch(userType) {
        case 'admin':
          profileEndpoint = BASE_URL + "/v1/admin/profile";
          break;
        case 'student':
          profileEndpoint = BASE_URL + "/v1/student/profile";
          break;
        case 'educator':
          profileEndpoint = BASE_URL + "/v1/educator/profile";
          break;
        default:
          profileEndpoint = PROFILE_API; // fallback
      }

      const profileRes = await apiConnector("GET", profileEndpoint, null, {
        Authorization: `Bearer ${accessToken}`,
      });

      const userProfile = profileRes.data?.profile; // <-- Lấy từ profile
      if (!userProfile) {
        throw new Error("Failed to load profile");
      }

      const userImage =
          userProfile.image ||
          `https://api.dicebear.com/5.x/initials/svg?seed=${
              userProfile.username || userProfile.email
          }`;

      const finalUser = { ...userProfile, image: userImage, userType };

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