import { useState, useEffect } from "react";
import Profilebackground from "../assets/profile-bg.jpeg";
import DefaultProfile from "../assets/profile-pic.png";
import WebflowLogo from "../assets/webflow-logo.svg";
import ImageUploaderPopup from "../components/ImageUploaderPopup";

export default function ProfileCard() {
  const [ProfilePic, setProfilePic] = useState<string | null>(() => {
    return localStorage.getItem("profilePic") || null;
  });
  const [isUploaderOpen, setUploaderOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleUploadComplete = (url: string) => {
    setProfilePic(url);
    localStorage.setItem("profilePic", url);
    setStatus("success");
    setUploaderOpen(false);
  };

  const handleUploadError = () => {
    setStatus("error");
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="w-full h-screen flex flex-col gap-24 items-center justify-center">
      {/* Status Bar */}
      {status && (
        <div
          className={`text-center text-sm font-medium py-2 rounded-[20px] ${
            status === "success"
              ? "text-[#15803D] bg-[#F0FDF4] border p-1 px-2.5"
              : "text-[#DC2626] bg-[#FEF2F2] border p-1 px-2.5"
          }`}
        >
          <p className="flex items-center justify-center">
            <span
              className={`inline-block px-2 py-1 rounded-[20px] ${
                status === "success"
                  ? "bg-white text-[#15803D]"
                  : "bg-white text-[#991B1B]"
              }`}
            >
              {status === "success" ? "Success" : "Error"}
            </span>
            <span className="ml-2">
              {status === "success"
                ? "Changes saved successfully"
                : "Something went wrong. Please try again."}
            </span>
          </p>
        </div>
      )}

      {/* Profile Card */}
      <div className="relative max-w-[320px] md:max-w-3xl w-full h-[428px] md:h-[420px] mx-auto items-center rounded bg-white border-[1px] shadow-custom-dark mt-4">
        <div className="w-full h-[176px]">
          <img
            className="w-[320px] md:w-full h-[128px] md:h-full bg-cover bg-center"
            src={Profilebackground}
            alt="Profile Background"
          />
        </div>
        <div className="relative p-4">
          <div className="absolute top-[-135%] md:top-[25%] left-[20%] md:left-[15%] transform -translate-x-1/2 -translate-y-1/2">
            <img
              className="w-24 h-24 md:w-40 md:h-40 rounded-full border-[6px] border-white"
              src={ProfilePic || DefaultProfile}
              alt="Profile Picture"
            />
          </div>
        </div>
        <div className="flex justify-end pr-6">
          <button
            onClick={() => setUploaderOpen(true)}
            className="px-4 py-2 ml-6 border-[1px] rounded h-11 text-center items-center"
          >
            Update picture
          </button>
        </div>
        <div className="pt-5 ml-5 md:ml-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral leading-9">
            Jack Smith
          </h1>
        </div>
        <div className="md:flex md:flex-row gap-3 text-xl font-normal items-center space-y-2 pt-1 md:pt-5 ml-5 md:ml-10">
          <h2>@kingjack . </h2>
          <h2>Senior Product Designer</h2>
          <div className="flex gap-2 flex-row">
            <h2>at</h2>
            <div className="flex gap-1">
              <img src={WebflowLogo} alt="" /> <h2> Webflow . </h2>
            </div>
            <h2>He/Him</h2>
          </div>
        </div>
        {isUploaderOpen && (
          <ImageUploaderPopup
            onClose={() => setUploaderOpen(false)}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        )}
      </div>
    </div>
  );
}
