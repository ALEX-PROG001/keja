import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/post/all", {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Sort posts by newest first
        const sortedPosts = (data.posts || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog</h1>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div>No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <BlogPost key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function BlogPost({ post }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="border rounded-lg shadow-md bg-white overflow-hidden">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{post.title}</h2>
        <p className={`text-gray-700 ${expanded ? "" : "line-clamp-3"}`}>
          {post.content}
        </p>
        <button onClick={toggleExpanded} className="text-blue-500 mt-2">
          {expanded ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
}
