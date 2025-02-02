import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
// import axios from "axios";
import { enqueueSnackbar } from "notistack";
import axios from "@/utils/axios";

const PhotoUploadModal = ({
  className = "",
  exhibitionId,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
  exhibitionId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("Content-Type", selectedFile.type);
      try {
        const upload_response = await axios.post(
          "/api/storage/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (upload_response.status === 200) {
          const submit_response = await axios.post(
            `/api/exhibitions/${exhibitionId}/submit`,
            {
              title: title,
              caption: caption,
              image_url: upload_response.data,
            }
          );
          if (submit_response.status === 201) {
            enqueueSnackbar("Photo submitted", {
              variant: "success",
            });
            setIsOpen(false);
            setSelectedFile(null);
            setPreviewUrl(null);
          }
        }
      } catch (error) {
        enqueueSnackbar("Submit failed", {
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
          <form className="modal-box" onSubmit={handleUpload}>
            <h3 className="font-bold text-lg">Submit a Photo</h3>
            <p className="py-2">Select a photo to upload:</p>
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full mt-2 my-4"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Caption"
              className="input input-bordered w-full mt-2 my-4"
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
            <input
              type="file"
              name="file"
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
              <input type="submit" className="btn btn-primary" value="Upload" />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PhotoUploadModal;
