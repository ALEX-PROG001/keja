import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function CreatePosts() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Add state for image URL
  const [publishError, setPublishError] = useState(null);
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
        placeholder: "Write something...",
      });

      // Override the default image handler to upload and insert images
      quillRef.current.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const file = input.files[0];
            try {
              const imageUrl = await handleImageUpload(file);
              const range = quillRef.current.getSelection();
              quillRef.current.insertEmbed(range.index, "image", imageUrl);
            } catch (error) {
              console.error("Image upload failed:", error);
            }
          }
        };
      });

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  // Integrated image upload function using Cloudinary
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "keja_preset");
    formData.append("cloud_name", "deymyiezz");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deymyiezz/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setImageUrl(data.url); // Save the URL to state
      return data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { 
        title, 
        content,
        image: imageUrl // Include the image URL in post data
      };
      
      const res = await fetch("http://localhost:3000/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      navigate("/my-posts");
    } catch (error) {
      console.error("Submission error:", error);
      setPublishError(error.message || "Something went wrong");
    }
  };

return (
  <div className="flex flex-col min-h-screen bg-slate-50 relative">
    {/* Scrollable content area */}
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-4">
        <h2 className="text-[#0e141b] text-lg font-bold text-center w-full mt-6">
          Create Post
        </h2>

        {/* Title Input */}
        <div className="w-full max-w-xl mx-auto mt-4">
          <input
            placeholder="Title"
            required
            className="w-full rounded-xl border-none bg-[#e7edf3] h-14 px-4 text-base focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Rich Text Editor */}
        <div className="w-full max-w-3xl mx-auto mt-4 mb-20">
          <div className="border border-gray-300 rounded-xl bg-white p-2">
            <div 
              ref={editorRef} 
              className="min-h-[250px] max-h-[500px] overflow-y-auto"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Fixed bottom bar - outside scrollable area */}
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-slate-50 border-t border-gray-200 p-4">
        <div className="max-w-xl mx-auto">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full h-12 bg-blue-600 text-white rounded-xl text-base font-bold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>

        {/* Error Message */}
        {publishError && (
          <div className="absolute -top-16 left-0 right-0 text-center">
            <div className="text-red-600 bg-white p-2 rounded-lg shadow-lg inline-block">
              {publishError}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
