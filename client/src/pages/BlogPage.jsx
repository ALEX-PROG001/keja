import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/post/all", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (err) {
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getFirstImage = (content) => {
    const match = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    return match ? match[1] : null;
  };

  const openPost = (post) => {
    setExpandedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePost = () => {
    setExpandedPost(null);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh] text-xl text-gray-600">
          Loading posts...
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh] text-xl text-red-600">
          {error}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Posts</h1>
          <button
            onClick={() => navigate("/create-post")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            <span>New Post</span>
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No posts available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const firstImage = getFirstImage(post.content);

              return (
                <article
                  key={post._id}
                  className="relative rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
                  onClick={() => openPost(post)}
                >
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt="Post"
                      className="w-full h-full object-cover aspect-[16/9] sm:aspect-[4/3] lg:aspect-[3/2]"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}

                  <div className="absolute inset-x-2 bottom-2 bg-white/20 backdrop-blur-lg border border-white/30 px-4 py-2 flex justify-between items-center rounded-full">
                    <h2 className="text-black text-lg font-semibold">{post.title}</h2>
                  </div>

                  <div className="absolute top-3 right-3 bg-white/70 p-2 rounded-full hover:bg-white transition">
                    <ArrowRight size={20} className="text-gray-800" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />

      {expandedPost && (
        <>
          <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-lg z-40 transition-opacity"></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={closePost}
                className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-50"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{expandedPost.title}</h2>

              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: expandedPost.content }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
