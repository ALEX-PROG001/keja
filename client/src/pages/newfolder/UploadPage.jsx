//Uploadimage after 

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function UploadImage({ onUploadComplete, initialImages = [] }) {
  // Initialize selectedImages with preexisting images, if any.
  const [selectedImages, setSelectedImages] = useState(
    initialImages.map(url => ({ url, isNew: false }))
  );
  const [uploading, setUploading] = useState(false);
  const [checkedImages, setCheckedImages] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);

  // When initialImages changes, update selectedImages.
  useEffect(() => {
    setSelectedImages(initialImages.map(url => ({ url, isNew: false })));
  }, [initialImages]);

  // Ensure that each image is marked as checked (default true).
  useEffect(() => {
    const newChecked = {};
    selectedImages.forEach(image => {
      // Retain previous state if available; otherwise default to true.
      newChecked[image.url] = checkedImages[image.url] !== undefined ? checkedImages[image.url] : true;
    });
    setCheckedImages(newChecked);
  }, [selectedImages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
    if (files.length + selectedImages.length > 9) {
      alert("Maximum 9 images allowed");
      return;
    }

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));

    setSelectedImages(prev => [...prev, ...newImages]);

    // Set newly added images as checked by default.
    const newCheckedState = {};
    newImages.forEach(image => {
      newCheckedState[image.url] = true;
    });
    setCheckedImages(prev => ({ ...prev, ...newCheckedState }));
    setUploadComplete(false);
  };

  const toggleCheck = (url) => {
    setCheckedImages(prev => ({ ...prev, [url]: !prev[url] }));
  };

  const handleUpload = async () => {
    setUploading(true);
    const newUploadedUrls = [];

    // Upload only new images that are checked.
    for (const image of selectedImages) {
      if (image.isNew && checkedImages[image.url]) {
        const data = new FormData();
        data.append("file", image.file);
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
    }

    setUploading(false);
    setUploadComplete(true);

    // Gather final URLs: combine preexisting images still checked with newly uploaded ones.
    const existingUrls = selectedImages
      .filter(image => !image.isNew && checkedImages[image.url])
      .map(image => image.url);
    const finalUrls = [...existingUrls, ...newUploadedUrls];

    if (onUploadComplete) {
      onUploadComplete(finalUrls);
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
          Select Files
        </label>
        {selectedImages.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`py-2 px-4 rounded-lg flex-1 shadow-md ${
              uploading ? "bg-gray-400 text-black" : "bg-white text-black"
            }`}
          >
            {uploading ? "Uploading..." : uploadComplete ? "Upload Complete" : "Upload Images"}
          </button>
        )}
      </div>

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4 w-full">
          {selectedImages.map(({ url }) => (
            <div key={url} className="relative">
              <img src={url} alt="preview" className="w-full h-24 object-cover rounded-lg shadow-md" />
              <button
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                onClick={() => toggleCheck(url)}
              >
                {checkedImages[url] && <CheckCircle className="text-green-500" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

