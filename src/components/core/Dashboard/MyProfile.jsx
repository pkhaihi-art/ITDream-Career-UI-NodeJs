import { useEffect } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import IconBtn from "../../common/IconBtn";
import Img from "../../common/Img";
import { formattedDate } from "../../../utils/dateFormatter.js";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);

  if (!user) {
    return <div className="text-center text-richblack-300">Loading profile...</div>;
  }

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fallback để tránh crash nếu user chưa có dữ liệu
  const fullName = user?.fullName || user?.username || "Unknown User";
  const email = user?.email || "No email provided";
  const username = user?.username || "No username";
  const phone = user?.phone || "Add phone number";
  const birthday = user?.birthday ? formattedDate(user.birthday) : "Add date of birth";

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
                alt={`profile-${username}`}
                className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                {fullName}
              </p>
              <p className="text-sm text-richblack-300">{email}</p>
            </div>
          </div>

          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* Personal Details */}
        <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-7 sm:px-12">
          <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold text-richblack-5">
              Personal Details
            </p>
            <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
              <RiEditBoxLine />
            </IconBtn>
          </div>

          <div className="flex flex-col sm:flex-row max-w-[500px] justify-between gap-y-5">
            <div className="flex flex-col gap-y-5">
              <InfoField label="Full Name" value={fullName} />
              <InfoField label="Username" value={username} />
              <InfoField label="Email" value={email} />
            </div>

            <div className="flex flex-col gap-y-5">
              <InfoField label="Phone" value={phone} />
              <InfoField label="Birthday" value={birthday} />
            </div>
          </div>
        </div>
      </>
  );
}

// Tách component nhỏ cho từng field
function InfoField({ label, value }) {
  return (
      <div>
        <p className="mb-2 text-sm text-richblack-600">{label}</p>
        <p className="text-sm font-semibold text-richblack-5 capitalize">
          {value}
        </p>
      </div>
  );
}
