import { useEffect } from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
import Img from './../../common/Img';



export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate();


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
      <>
        <h1 className="mb-14 text-4xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
          My Profile
        </h1>

        {/* Header Profile */}
        <div className="flex items-center justify-between rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
          <div className="flex items-center gap-x-4">
            <Img
                src={user?.image}
                alt={`profile-${user?.username}`}
                className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                {user?.fullName || user?.username}
              </p>
              <p className="text-sm text-richblack-300">{user?.email}</p>
            </div>
          </div>

          <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* Personal Details */}
        <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-7 sm:px-12">
          <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold text-richblack-5">
              Personal Details
            </p>
            <IconBtn
                text="Edit"
                onclick={() => navigate("/dashboard/settings")}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>

          <div className="flex max-w-[500px] justify-between">
            <div className="flex flex-col gap-y-5">
              <div>
                <p className="mb-2 text-sm text-richblack-600">Full Name</p>
                <p className="text-sm font-semibold text-richblack-5 capitalize">
                  {user?.fullName}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm text-richblack-600">Username</p>
                <p className="text-sm font-semibold text-richblack-5 capitalize">
                  {user?.username}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm text-richblack-600">Email</p>
                <p className="text-sm font-semibold text-richblack-5">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-y-5">
              <div>
                <p className="mb-2 text-sm text-richblack-600">Phone</p>
                <p className="text-sm font-semibold text-richblack-5">
                  {user?.phone ?? "Add phone number"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm text-richblack-600">Birthday</p>
                <p className="text-sm font-semibold text-richblack-5">
                  {user?.birthday ?? "Add date of birth"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm text-richblack-600">Role</p>
                <p className="text-sm font-semibold text-richblack-5 capitalize">
                  {user?.kind === 1 ? "Admin" : user?.kind === 2 ? "Educator" : "Student"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}