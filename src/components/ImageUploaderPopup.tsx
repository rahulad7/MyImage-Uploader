import React, { useState } from "react";
import Dropzone, { DropEvent, FileRejection } from "react-dropzone";
import CancelButton from "../assets/cancel-button.svg";
import UploadThumbnail from "../assets/upload-thumbnail.svg";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utlis/cropImage";
import { uploadImage } from "../firebaseConfig";

interface ImageUploaderPopupProps {
  onClose: () => void;
  onUploadComplete: (url: string) => void;
  onUploadError: () => void; // Added for error handling
}

const ImageUploaderPopup: React.FC<ImageUploaderPopupProps> = ({
  onClose,
  onUploadComplete,
  onUploadError
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const handleDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[], event: DropEvent) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setCroppingImage(URL.createObjectURL(file));
    }
  };

  const handleCropComplete = async () => {
    try {
      if (!croppingImage || !selectedFile) {
        throw new Error("No image to crop");
      }

      const pixelCrop = {
        x: crop.x,
        y: crop.y,
        width: 400,
        height: 400,
      };

      console.log("Cropping Image URL:", croppingImage);
      console.log("Crop Parameters:", pixelCrop);

      const croppedImageBlob = await getCroppedImg(
        croppingImage,
        pixelCrop,
        zoom
      );

      if (!croppedImageBlob) {
        throw new Error("Failed to get cropped image");
      }

      const croppedFile = new File([croppedImageBlob], selectedFile.name, {
        type: selectedFile.type,
      });

      await handleUpload(croppedFile);
      setCroppingImage(null);
    } catch (error) {
      console.error("Crop failed:", error);
      setStatusMessage("Crop failed. Please try again.");
      setStatusType("error");
      onUploadError(); // Call error handler
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const url = await uploadImage(file);
      onUploadComplete(url);
      setStatusMessage("Changes saved successfully");
      setStatusType("success");
    } catch (uploadError) {
      console.error(uploadError);
      setStatusMessage(
        "Upload failed. Please retry or contact us if you believe this is a bug"
      );
      setStatusType("error");
      onUploadError(); // Call error handler
    }
  };

  return (
    <>
      {/* Image Upload Popup */}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full h-[344px] max-w-xs md:max-w-lg">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-2">Upload Image(s)</h2>
            <div>
              <img
                onClick={onClose}
                className="cursor-pointer"
                src={CancelButton}
                alt="cancel-button"
              />
            </div>
          </div>
          <h3 className="mb-3">You may upload up to 5 images</h3>
          <Dropzone
            onDrop={handleDrop}
            accept={{ "image/jpeg": [], "image/png": [] }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-solid border-2 mt-5 max-w-[576px] rounded h-[192px] border-gray-300 p-4 text-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <img
                  className="justify-center mx-auto mt-5"
                  src={UploadThumbnail}
                  alt=""
                />
                <p className="mt-3 text-lg font-medium">
                  Click or drag and drop to upload
                </p>
                <p className="text-sm font-normal">PNG, or JPG (Max 5MB)</p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>

      {/* Cropping Popup */}
      {croppingImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded w-[343px] h-[458px] max-w-lg border-0.5 border-neutral-200 shadow-custom-dark">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">Crop your picture</h2>
              <div>
                <img
                  onClick={() => setCroppingImage(null)}
                  className="cursor-pointer"
                  src={CancelButton}
                  alt="cancel-button"
                />
              </div>
            </div>
            <div className="relative h-[290px] w-[295px] mt-4">
              <Cropper
                image={croppingImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCroppingImage(null)}
                className="w-[142px] h-[44px] bg-white text-black text-base font-medium rounded border-0.5 border-neutral-200 shadow-custom-dark"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="w-[142px] h-[44px] bg-[#4338CA] text-base font-medium text-white rounded border-0.5 border-neutral-200 shadow-custom-dark"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploaderPopup;
