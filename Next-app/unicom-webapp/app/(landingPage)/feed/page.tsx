"use client";

import infra_config from '../../../public/infra_config.json';
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

interface Post {
  _id: string;
  title: string;
  price?: number;
  location?: string;
  image_url?: string[];
  category: string;
  owner: string;
  description?: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(9);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [semanticSearchTerm, setSemanticSearchTerm] = useState("");
  const [semanticSearching, setSemanticSearching] = useState(false);

  const [userInfoCache, setUserInfoCache] = useState<Record<string, any>>({});
  
  const { signedUrlData } = useAuth();
  const CLOUDFRONT_HOST = infra_config.cloudfront_url;
  const API_URL = infra_config.api_url;

  function buildSignedImageUrl(baseImageUrl: string, signedUrlData: any): string {
    const url = new URL(baseImageUrl);
    url.searchParams.set("Policy", signedUrlData["CloudFront-Policy"]);
    url.searchParams.set("Signature", signedUrlData["CloudFront-Signature"]);
    url.searchParams.set("Key-Pair-Id", signedUrlData["CloudFront-Key-Pair-Id"]);
    return url.toString();
  }

  const fetchUserInfo = async (email: string) => {
    if (userInfoCache[email]) return; // already fetched

    try {
      const idToken = localStorage.getItem("id_token");
      if (!idToken) {
        console.error("No ID token found");
        return;
      }

      const response = await fetch(
        `${API_URL}api/users/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch user info", response.status);
        return;
      }

      const data = await response.json();
      setUserInfoCache((prev) => ({ ...prev, [email]: data }));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Function to handle semantic search
  const handleSemanticSearch = async () => {
    if (!semanticSearchTerm.trim()) return;
    
    try {
      setSemanticSearching(true);
      const idToken = localStorage.getItem("id_token");
      if (!idToken) {
        console.error("No ID token found");
        return;
      }

      const response = await fetch(
        `${API_URL}api/posts/semanticsearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            query: semanticSearchTerm
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to perform semantic search", response.status);
        return;
      }

      const data = await response.json();
      let fetchedPosts = data || [];

      // Process images for each post
      fetchedPosts = fetchedPosts.map((post: Post) => {
        if (post.image_url && post.image_url.length > 0 && signedUrlData) {
          const updatedUrls = post.image_url.map((url) => {
            try {
              const parsedUrl = new URL(url);
              const cloudfrontUrl = CLOUDFRONT_HOST + parsedUrl.pathname.replace(/^\/+/, "");
              return buildSignedImageUrl(cloudfrontUrl, signedUrlData);
            } catch {
              return url;
            }
          });
          return { ...post, image_url: updatedUrls };
        }
        return post;
      });

      setSearchResults(fetchedPosts);
      setIsSemanticSearch(true);

      // Fetch user details for owners
      const uniqueOwners = Array.from(new Set(fetchedPosts.map((post) => post.owner)));
      uniqueOwners.forEach((ownerEmail) => {
        fetchUserInfo(ownerEmail);
      });

    } catch (error) {
      console.error("Error performing semantic search:", error);
    } finally {
      setSemanticSearching(false);
    }
  };

  useEffect(() => {
    if (!signedUrlData) return;

    const fetchPosts = async () => {
      if (isSemanticSearch) return; // Skip regular fetch if semantic search is active
      
      try {
        setLoading(true);
        const idToken = localStorage.getItem("id_token");
        if (!idToken) {
          console.error("No ID token found");
          return;
        }

        const response = await fetch(
          `${API_URL}api/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}&sort=${sortOrder}`,
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
        let fetchedPosts = (data.posts as Post[]) || [];
        setTotal(data.total || 0);

        fetchedPosts = fetchedPosts.map((post: Post) => {
          if (post.image_url && post.image_url.length > 0 && signedUrlData) {
            const updatedUrls = post.image_url.map((url) => {
              try {
                const parsedUrl = new URL(url);
                const cloudfrontUrl = CLOUDFRONT_HOST + parsedUrl.pathname.replace(/^\/+/, "");
                return buildSignedImageUrl(cloudfrontUrl, signedUrlData);
              } catch {
                return url;
              }
            });
            return { ...post, image_url: updatedUrls };
          }
          return post;
        });

        setPosts(fetchedPosts);

        // fetch user details for owners
        const uniqueOwners = Array.from(new Set(fetchedPosts.map((post) => post.owner)));
        uniqueOwners.forEach((ownerEmail) => {
          fetchUserInfo(ownerEmail);
        });

      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit, searchQuery, category, sortOrder, signedUrlData, isSemanticSearch]);

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

  const resetSemanticSearch = () => {
    setIsSemanticSearch(false);
    setSearchResults([]);
    setSemanticSearchTerm("");
  };

  const displayPosts = isSemanticSearch ? searchResults : posts;

  if (loading && !isSemanticSearch) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* My Feed Section */}
      <section className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">My Feed</h2>

        {/* Toggle between regular and semantic search */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsSemanticSearch(false)}
            className={`px-4 py-2 rounded-md ${
              !isSemanticSearch
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Regular Search
          </button>
          <button
            onClick={() => setIsSemanticSearch(true)}
            className={`px-4 py-2 rounded-md ${
              isSemanticSearch
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Semantic Search
          </button>
        </div>

        {isSemanticSearch ? (
          <div className="flex items-center mb-6">
            <input
              type="text"
              value={semanticSearchTerm}
              onChange={(e) => setSemanticSearchTerm(e.target.value)}
              placeholder="Describe what you're looking for (e.g. 'room near campus with parking')"
              className="border p-2 rounded-l-md w-full max-w-md"
            />
            <button
              onClick={handleSemanticSearch}
              disabled={semanticSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {semanticSearching ? "Searching..." : "Search"}
            </button>
            {searchResults.length > 0 && (
              <button
                onClick={resetSemanticSearch}
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="border p-2 rounded-l-md w-full max-w-md"
            />
            <button
              onClick={() => {
                setPage(1);
                setSearchQuery(searchTerm);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        )}

        {!isSemanticSearch && (
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="border p-2 rounded-md"
            >
              <option value="">All Categories</option>
              <option value="SELL">Sell</option>
              <option value="ROOMMATE">Roommate</option>
              <option value="CARPOOL">Carpool</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="border p-2 rounded-md"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        )}

        {isSemanticSearch && searchResults.length === 0 && semanticSearchTerm && !semanticSearching && (
          <div className="text-center py-8 text-gray-500">
            No results found for your search. Try different keywords or phrasing.
          </div>
        )}

        {semanticSearching && (
          <div className="text-center py-8 text-gray-500">
            Searching for posts matching your description...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post) => {
            const userInfo = userInfoCache[post.owner];

            return (
              <div
                key={post._id}
                className="border rounded-md overflow-hidden shadow-sm bg-white cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedPost(post)}
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
                    Posted by{" "}
                    <a
                      href={`mailto:${post.owner}`}
                      className="text-blue-500 hover:underline"
                    >
                      {post.owner}
                    </a>
                  </p>

                  {userInfo && (
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <div><strong>Name:</strong> {userInfo.name || "N/A"}</div>
                      <div><strong>College:</strong> {userInfo.college || "N/A"}</div>
                      <div><strong>Department:</strong> {userInfo.department || "N/A"}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls - only show for regular search */}
        {!isSemanticSearch && (
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
        )}
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
                Posted by:{" "}
                <a
                  href={`mailto:${selectedPost.owner}`}
                  className="text-blue-500 hover:underline"
                >
                  {selectedPost.owner}
                </a>
              </p>

              {/* User Info inside Modal */}
              {userInfoCache[selectedPost.owner] && (
                <div className="mt-4 text-gray-600 space-y-1">
                  <div><strong>Name:</strong> {userInfoCache[selectedPost.owner].name || "N/A"}</div>
                  <div><strong>College:</strong> {userInfoCache[selectedPost.owner].college || "N/A"}</div>
                  <div><strong>Department:</strong> {userInfoCache[selectedPost.owner].department || "N/A"}</div>
                </div>
              )}

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