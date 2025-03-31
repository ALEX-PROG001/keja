import React, { useState } from "react";
import UploadImage from "./uploadpage"; // Adjust the path if necessary

export default function TestUploadPage() {
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleUploadComplete = (urls) => {
    setUploadedUrls(urls);
    if (urls.length > 0) {
      alert("Image uploaded successfully!");
    } else {
      alert("Image upload failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Test Image Upload</h2>
      <UploadImage onUploadComplete={handleUploadComplete} />
      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Uploaded Image:</h3>
          <img src={uploadedUrls[0]} alt="Uploaded" className="mt-2 w-64 h-64 object-cover rounded shadow" />
        </div>
      )}
    </div>
  );
}
