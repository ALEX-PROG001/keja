// Postimage.jsx
export async function uploadPostImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "keja_preset"); // Cloudinary preset
    formData.append("cloud_name", "deymyiezz");
  
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deymyiezz/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  }
  