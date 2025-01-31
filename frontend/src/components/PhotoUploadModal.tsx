import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const PhotoUploadModal = ({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const handleUpload = async (e: any) => {
    if (selectedFile) {
      console.log("Uploading:", selectedFile.name);
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsOpen(false);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("Content-Type", file.type);
      formData.append("permission", "public");
      try {
        const upload_response = await axios.post("/storage/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (error) {
        enqueueSnackbar("Profile picture upload failed", {
          variant: "error",
        });
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      {children ? (
        <div className={className} onClick={() => setIsOpen(true)}>
          {children}
        </div>
      ) : (
        <button
          className={twMerge("btn btn-primary", className)}
          onClick={() => setIsOpen(true)}
        >
          Upload Photo
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Upload a Photo</h3>
            <p className="py-2">Select a photo to upload:</p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold">Preview:</h4>
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="w-full h-auto rounded-lg mt-2 shadow-md"
                />
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoUploadModal;
