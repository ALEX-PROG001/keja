import React, { useState } from "react";

export default function PostCard({ title, content, image }) {
  const [expanded, setExpanded] = useState(false);
  const [orientation, setOrientation] = useState("square"); // Default orientation

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth > naturalHeight) {
      setOrientation("horizontal");
    } else if (naturalHeight > naturalWidth) {
      setOrientation("vertical");
    } else {
      setOrientation("square");
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={`border rounded-lg p-2 shadow-md bg-white overflow-hidden ${
        orientation === "vertical" ? "col-span-1" : "col-span-2"
      }`}
    >
      <img
        src={image}
        alt={title}
        onLoad={handleImageLoad}
        className={`w-full object-cover rounded ${
          orientation === "vertical" ? "h-[300px]" : "h-[200px]"
        }`}
      />
      <div className="p-2">
        <h2 className="text-lg font-bold mb-1">{title}</h2>
        <p className={`text-gray-700 ${expanded ? "" : "line-clamp-3"}`}>
          {content}
        </p>
        <button onClick={toggleExpanded} className="text-blue-500 mt-1">
          {expanded ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
}
