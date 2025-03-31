import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Trash2 } from "lucide-react";

export default function UploadImage({ onUploadComplete, existingImages = [] }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [checkedImages, setCheckedImages] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState(existingImages);

  useEffect(() => {
    // Initialize checked state for existing images
    const initialChecked = {};
    existingImages.forEach((url) => (initialChecked[url] = true));
    setCheckedImages(initialChecked);
  }, [existingImages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"));
    
    const totalImages = uploadedUrls.length + selectedImages.length + files.length;
    if (totalImages > 9) {
      alert(`Maximum 9 images allowed. You can add ${9 - uploadedUrls.length - selectedImages.length} more.`);
      return;
    }

    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setSelectedImages((prev) => [...prev, ...newImages]);

    // Mark new images as checked by default
    const newCheckedState = {};
    newImages.forEach((image) => (newCheckedState[image.url] = true));
    setCheckedImages((prev) => ({ ...prev, ...newCheckedState }));
  };

  const toggleCheck = (url) => {
    setCheckedImages((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const removeImage = (url) => {
    setUploadedUrls((prev) => prev.filter((img) => img !== url));
    setCheckedImages((prev) => {
      const updated = { ...prev };
      delete updated[url];
      return updated;
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    const newUploadedUrls = [...uploadedUrls];

    for (const { file, url } of selectedImages) {
      if (!checkedImages[url]) continue;

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "keja_preset");
      data.append("cloud_name", "deymyiezz");

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/deymyiezz/image/upload", {
          method: "POST",
          body: data,
        });
        const uploadedImage = await response.json();
        newUploadedUrls.push(uploadedImage.url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setUploading(false);
    setUploadedUrls(newUploadedUrls);
    setSelectedImages([]); // Clear selected images after upload

    if (onUploadComplete) {
      onUploadComplete(newUploadedUrls);
    }
  };

  return (
    <motion.div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-sm mx-auto">
      <input
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        id="file-input"
      />
      <div className="flex w-full gap-2">
        <label
          htmlFor="file-input"
          className="bg-gray-300 text-black py-2 px-4 rounded-lg cursor-pointer flex-1 text-center shadow-md"
        >
          Add Photos
        </label>
        {(selectedImages.length > 0 || uploadedUrls.length > 0) && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`py-2 px-4 rounded-lg flex-1 shadow-md ${
              uploading ? "bg-gray-400 text-black" : "bg-black text-white"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>

      {/* Image Preview Section */}
      {(selectedImages.length > 0 || uploadedUrls.length > 0) && (
        <div className="grid grid-cols-3 gap-2 mt-4 w-full">
          {uploadedUrls.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="uploaded" className="w-full h-24 object-cover rounded-lg shadow-md" />
              <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md" onClick={() => removeImage(url)}>
                <Trash2 className="text-red-500" />
              </button>
            </div>
          ))}
          {selectedImages.map(({ url }) => (
            <div key={url} className="relative">
              <img src={url} alt="preview" className="w-full h-24 object-cover rounded-lg shadow-md" />
              <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md" onClick={() => toggleCheck(url)}>
                {checkedImages[url] && <CheckCircle className="text-green-500" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
