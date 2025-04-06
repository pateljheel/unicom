// app/myposts/page.tsx
import React from 'react';

interface Post {
  id: number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
}

const myPosts: Post[] = [
  {
    id: 1,
    title: 'OfficeChair',
    price: 40,
    location: 'Park Point, Rochester',
    imageUrl: '/images/office-chair.jpg', // Update with your actual image path
  },
  {
    id: 2,
    title: 'TableLamp',
    price: 40,
    location: 'Province, Rochester',
    imageUrl: '/images/table-lamp.jpg',
  },
  {
    id: 3,
    title: 'StudyTable',
    price: 40,
    location: 'Clayton, Rochester',
    imageUrl: '/images/study-table.jpg',
  },
];

export default function MyPostsPage() {
  return (
    <div className="p-4">
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
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-md overflow-hidden shadow-sm bg-white"
            >
              <div className="h-48 w-full bg-gray-200">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-gray-700">{post.location}</p>
                <p className="text-green-700 font-semibold">${post.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
