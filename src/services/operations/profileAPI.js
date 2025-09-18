import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const { 
  GET_ADMIN_DETAILS_API, 
  GET_STUDENT_DETAILS_API, 
  GET_EDUCATOR_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API, 
  GET_INSTRUCTOR_DATA_API 
} = profileEndpoints


// ================ get User Details  ================
export function getUserDetails(token, userType, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      // Chọn endpoint dựa trên loại người dùng
      let profileEndpoint;
      switch(userType) {
        case 'admin':
          profileEndpoint = GET_ADMIN_DETAILS_API;
          break;
        case 'student':
          profileEndpoint = GET_STUDENT_DETAILS_API;
          break;
        case 'educator':
          profileEndpoint = GET_EDUCATOR_DETAILS_API;
          break;
        default:
          profileEndpoint = GET_ADMIN_DETAILS_API; // fallback
      }

      const response = await apiConnector("GET", profileEndpoint, null, { Authorization: `Bearer ${token}`, })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.message) {
        throw new Error(response.data.message || "Failed to get user details")
      }
      
      const userProfile = response.data.profile;
      const userImage = userProfile.image
        ? userProfile.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${userProfile.fullName || userProfile.username}`
      dispatch(setUser({ ...userProfile, image: userImage, userType }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ================ get User Enrolled Courses  ================
export async function getUserEnrolledCourses(token) {
  // const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, {token}, { Authorization: `Bearer ${token}`, })

    console.log("GET_USER_ENROLLED_COURSES_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  // toast.dismiss(toastId)
  return result
}

// ================ get Instructor Data  ================
export async function getInstructorData(token) {
  // const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  // toast.dismiss(toastId)
  return result
}
