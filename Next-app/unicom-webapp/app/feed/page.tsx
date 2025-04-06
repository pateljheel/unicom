"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import framer-motion

interface Post {
  _id: string;
  title: string;
  price?: number;
  location?: string;
  image_url?: string[];
  category: string;
  owner: string;
  description?: string; // You may want description too
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // 👈 Modal control

  const CLOUDFRONT_HOST = "https://dpro9nxekr9pa.cloudfront.net/";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const idToken = localStorage.getItem("id_token");
        if (!idToken) {
          console.error("No ID token found");
          return;
        }

        const response = await fetch(
          `https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch posts", response.status);
          return;
        }

        const data = await response.json();
        let fetchedPosts = data.posts || [];
        setTotal(data.total || 0);

        fetchedPosts = fetchedPosts.map((post: Post) => {
          if (post.image_url && post.image_url.length > 0) {
            const updatedUrls = post.image_url.map((url) => {
              try {
                const parsedUrl = new URL(url);
                return CLOUDFRONT_HOST + parsedUrl.pathname.replace(/^\/+/, "");
              } catch {
                return url;
              }
            });
            return { ...post, image_url: updatedUrls };
          }
          return post;
        });

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit]);

  const handleNext = () => {
    if (page * limit < total) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const closeModal = () => setSelectedPost(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* Action Buttons */}
      <div className="flex items-center space-x-4 p-4 bg-white mt-2 shadow-sm">
        <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Old Posts
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Recent
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Edit Post
        </button>
      </div>

      {/* My Feed Section */}
      <section className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">My Feed</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-md overflow-hidden shadow-sm bg-white cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedPost(post)} // 👈 Click to open modal
            >
              <div className="h-48 w-full bg-gray-200">
                {post.image_url && post.image_url.length > 0 ? (
                  <img
                    src={post.image_url[0]}
                    alt={post.title}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{post.category}</p>
                {post.location && (
                  <p className="text-gray-700">{post.location}</p>
                )}
                {post.price !== undefined && (
                  <p className="text-green-700 font-semibold">${post.price}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Posted by {post.owner}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {page} of {Math.ceil(total / limit)}
          </p>
          <button
            onClick={handleNext}
            disabled={page * limit >= total}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white shadow-2xl z-50 overflow-auto"
          >
            <div className="p-6">
              <button
                onClick={closeModal}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>

              <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-gray-600 mb-4">{selectedPost.category}</p>

              {selectedPost.image_url && selectedPost.image_url.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {selectedPost.image_url.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Image ${idx + 1}`}
                      className="w-100 h-100 object-cover rounded-md shadow-md"
                    />
                  ))}
                </div>
              )}

              {selectedPost.location && (
                <p className="mt-4 text-gray-700">
                  <strong>Location:</strong> {selectedPost.location}
                </p>
              )}
              {selectedPost.price !== undefined && (
                <p className="text-green-700 font-semibold">
                  Price: ${selectedPost.price}
                </p>
              )}
              <p className="text-gray-500 mt-2">
                Posted by: {selectedPost.owner}
              </p>

              {selectedPost.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedPost.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
