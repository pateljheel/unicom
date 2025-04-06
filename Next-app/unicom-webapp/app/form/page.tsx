"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";

export default function ListingForm() {
  const [category, setCategory] = useState("");
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts";

  // Debug token availability
  useEffect(() => {
    console.log("Token from context:", token);
    console.log("Is authenticated:", isAuthenticated);
  }, [token, isAuthenticated]);

  // Helper function to convert file to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !isAuthenticated) {
      alert("You are not authenticated. Please log in again.");
      router.push("/login"); // Adjust to your login route
      return;
    }

    const formData: any = {
      category: category,
      title: "",
      description: "",
      images: [],
    };

    if (category === "roommate") {
      formData.description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
      formData.community = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
      formData.start_date = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
      formData.rent = 1000; // Example value; adjust as needed
      formData.general_preferences = "any";
    } else if (category === "carpool") {
      formData.from_location = (document.getElementById("pickupLocation") as HTMLInputElement)?.value;
      formData.to_location = (document.getElementById("dropoffLocation") as HTMLInputElement)?.value;
      const date = (document.getElementById("rideDate") as HTMLInputElement)?.value;
      const time = (document.getElementById("rideTime") as HTMLInputElement)?.value;
      formData.departure_time = new Date(`${date}T${time}`).toISOString();
      formData.seats_available = parseInt(
        (document.getElementById("availableSeats") as HTMLInputElement)?.value || "1"
      );
      formData.description = "Ride available";
    } else if (category === "SELL") {
      formData.title = (document.getElementById("title") as HTMLInputElement)?.value;
      formData.description = (document.getElementById("itemDescription") as HTMLTextAreaElement)?.value;
      formData.price = parseFloat(
        (document.getElementById("itemPrice") as HTMLInputElement)?.value || "0"
      );
      formData.item = (document.getElementById("itemName") as HTMLInputElement)?.value;
      formData.sub_category = (
        document.getElementById("subCategory") as HTMLSelectElement
      )?.value || "OTHER";

      const files = (document.getElementById("uploadImagesSell") as HTMLInputElement)?.files;
      const images: string[] = [];
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const base64 = await toBase64(files[i]);
          images.push(base64);
        }
      }
      formData.images = images;
    }

    // Print the payload in the console
    console.log("Payload:", formData);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Response Status:", response.status);

      if (response.status === 202) {
        alert("Listing submitted successfully and is under moderation!");
        router.push("/buttons");
      } else {
        alert("Error: " + (result.error || "Unknown error occurred"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong while submitting the post.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              <option value="roommate">Roommate finder</option>
              <option value="carpool">Carpool</option>
              <option value="SELL">Sell Item</option>
            </select>
          </div>

          {/* Fields for Roommate Finder */}
          {category === "roommate" && (
            <>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="apartmentName" className="block text-sm font-medium text-gray-700">
                  Apartment Name
                </label>
                <input
                  type="text"
                  id="apartmentName"
                  placeholder="Apartment Name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateAvailability" className="block text-sm font-medium text-gray-700">
                  Date Availability
                </label>
                <input
                  type="date"
                  id="dateAvailability"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">
                  Preferences
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="catFriendly"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor="catFriendly" className="ml-2 block text-sm text-gray-900">
                    Cat friendly
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="uploadImagesRoommate" className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="uploadImagesRoommate"
                  multiple
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
            </>
          )}

          {/* Fields for Carpool */}
          {category === "carpool" && (
            <>
              <div className="mb-4">
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  placeholder="Enter pickup location"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                  Drop-off Location
                </label>
                <input
                  type="text"
                  id="dropoffLocation"
                  placeholder="Enter drop-off location"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rideDate" className="block text-sm font-medium text-gray-700">
                  Ride Date
                </label>
                <input
                  type="date"
                  id="rideDate"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rideTime" className="block text-sm font-medium text-gray-700">
                  Ride Time
                </label>
                <input
                  type="time"
                  id="rideTime"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input
                  type="number"
                  id="availableSeats"
                  placeholder="Enter number of seats"
                  min="1"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          {/* Fields for Sell Item */}
          {category === "SELL" && (
            <>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter listing title"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  placeholder="Enter item name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="itemDescription"
                  placeholder="Enter item description"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="itemPrice"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Sub Category
                </label>
                <select
                  id="subCategory"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select sub-category</option>
                  <option value="FURNITURE">Furniture</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="CLOTHING">Clothing</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="uploadImagesSell" className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="uploadImagesSell"
                  multiple
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </CardContent>
    </Card>
  );
}


// "use client";


// import { useState, useEffect  } from "react";
// import { useRouter } from "next/navigation";
// // Adjust these imports to match your shadcn UI setup
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function ListingForm() {
//   const [category, setCategory] = useState("");
//   const router = useRouter();
//   const API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts";


//   // Log token on mount for debugging
//   // useEffect(() => {
//   //   console.log("Token in localStorage:", localStorage.getItem("token"));
//   // }, []);

//   // Helper function to convert file to Base64
//   const toBase64 = (file: File): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Retrieve token from localStorage (if available)
//     // const token = localStorage.getItem("token");
//     const token = "eyJraWQiOiJVejR2T3dXVnN6M2RTUWMxVDFTKzFlb0JCUHVZZGJ5K3owUDlheThzbFp3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRjJyVVBNdUtoMEx4OVNjb3JQWS1wQSIsInN1YiI6ImY0MjhiNDU4LWUwZTEtNzA2YS0yMGE3LTkzOTAzZDQzYzFhMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV80OHpFQ1h3YlkiLCJjb2duaXRvOnVzZXJuYW1lIjoiZjQyOGI0NTgtZTBlMS03MDZhLTIwYTctOTM5MDNkNDNjMWEwIiwiYXVkIjoiNjc5YnFqNnNlYjdxN3JnNmhldG1uY2cwaTAiLCJldmVudF9pZCI6ImQ1Zjg3MzkzLTk4MTktNDk4Ni1iMmZjLWI2MTc4NmY0Zjk4YiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzOTY1MjA3LCJleHAiOjE3NDQwNTE2MDcsImlhdCI6MTc0Mzk2NTIwNywianRpIjoiZDNmZDY5M2MtOWU1MC00YjcyLTgyYTAtYmUzNTU0NjhjYWYyIiwiZW1haWwiOiJiYTIxMTZAcml0LmVkdSJ9.O3P-FpLr7o1NJD4Ox0FghCab2REFd04XwlX0es8I9us13infF7LBRpZO1miuOo0FepA4-apHtfqqj-yyZ7hL0haR3ZJIHowlsxXx9fEoGZRiFJ8i11t_EtEfKTZMuoSAxwg1LyAcyQugMOSmWivFuLW0ePE63_P2vzyW3RiGr-oIF66NfPnn6_xSNypYnRLo2iLpoayosOcryvOtaLE9V5sBYFGEm1V8q0H3f45IGLFxPiRjCT8dH6Yy5OecgSNkZM-AdH-JqH5t_EkhYJt8jRbLAmRG5aHw3Kast-L4cR4XrA2t3Bz9baPXKu9mECyFa9gsxpeBNjhYP_9WOPiJNg"
  
//     // if (!token) {
//     //   alert("Token not found. Please log in again.");
//     //   return;
//     // }

//     const formData: any = {
//       category: category,
//       title: "",
//       description: "",
//       images: []
//     };

//     if (category === "roommate") {
//       formData.description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
//       formData.community = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
//       formData.start_date = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
//       formData.rent = 1000; // Example value; adjust as needed
//       formData.general_preferences = "any";
//     } else if (category === "carpool") {
//       formData.from_location = (document.getElementById("pickupLocation") as HTMLInputElement)?.value;
//       formData.to_location = (document.getElementById("dropoffLocation") as HTMLInputElement)?.value;
//       const date = (document.getElementById("rideDate") as HTMLInputElement)?.value;
//       const time = (document.getElementById("rideTime") as HTMLInputElement)?.value;
//       formData.departure_time = new Date(`${date}T${time}`).toISOString();
//       formData.seats_available = parseInt(
//         (document.getElementById("availableSeats") as HTMLInputElement)?.value || "1"
//       );
//       formData.description = "Ride available";
//     } else if (category === "SELL") {
//       // Gather fields for SELL post
//       formData.title = (document.getElementById("title") as HTMLInputElement)?.value;
//       formData.description = (document.getElementById("itemDescription") as HTMLTextAreaElement)?.value;
//       formData.price = parseFloat(
//         (document.getElementById("itemPrice") as HTMLInputElement)?.value || "0"
//       );
//       formData.item = (document.getElementById("itemName") as HTMLInputElement)?.value;
//       formData.sub_category = (
//         document.getElementById("subCategory") as HTMLSelectElement
//       )?.value || "OTHER";

//       const files = (document.getElementById("uploadImagesSell") as HTMLInputElement)?.files;
//       const images: string[] = [];
//       if (files) {
//         for (let i = 0; i < files.length; i++) {
//           const base64 = await toBase64(files[i]);
//           images.push(base64);
//         }
//       }
//       formData.images = images;
//     }

//     // Print the payload in the console
//   console.log("Payload:", formData);

//   try {
//     // Build headers; include Authorization only if token exists.
//     const headers: HeadersInit = {
//       "Content-Type": "application/json"
//     };
//     if (token) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers,
//       body: JSON.stringify(formData),
//     });

//     const result = await response.json();
//     console.log("Response Status:", response.status);

//     if (response.status === 202) {
//       alert("Listing submitted successfully and is under moderation!");
//       router.push("/buttons");
//     } else {
//       alert("Error: " + (result.error || "Unknown error occurred"));
//     }
//   } catch (err) {
//     console.error("Submission error:", err);
//     alert("Something went wrong while submitting the post.");
//   }
// };

//   return (
//     <Card className="max-w-md mx-auto mt-10">
//       <CardHeader>
//         <CardTitle>Create Listing</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit}>
//           {/* Category Dropdown */}
//           <div className="mb-4">
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               id="category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             >
//               <option value="">Select a category</option>
//               <option value="roommate">Roommate finder</option>
//               <option value="carpool">Carpool</option>
//               <option value="SELL">Sell Item</option>
//             </select>
//           </div>

//           {/* Fields for Roommate Finder */}
//           {category === "roommate" && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   placeholder="Enter description"
//                   rows={3}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="apartmentName" className="block text-sm font-medium text-gray-700">
//                   Apartment Name
//                 </label>
//                 <input
//                   type="text"
//                   id="apartmentName"
//                   placeholder="Apartment Name"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="dateAvailability" className="block text-sm font-medium text-gray-700">
//                   Date Availability
//                 </label>
//                 <input
//                   type="date"
//                   id="dateAvailability"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">
//                   Preferences
//                 </label>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="catFriendly"
//                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                   />
//                   <label htmlFor="catFriendly" className="ml-2 block text-sm text-gray-900">
//                     Cat friendly
//                   </label>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="uploadImagesRoommate" className="block text-sm font-medium text-gray-700">
//                   Upload Images
//                 </label>
//                 <input
//                   type="file"
//                   id="uploadImagesRoommate"
//                   multiple
//                   accept="image/*"
//                   className="mt-1 block w-full text-sm text-gray-500"
//                 />
//               </div>
//             </>
//           )}

//           {/* Fields for Carpool */}
//           {category === "carpool" && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
//                   Pickup Location
//                 </label>
//                 <input
//                   type="text"
//                   id="pickupLocation"
//                   placeholder="Enter pickup location"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
//                   Drop-off Location
//                 </label>
//                 <input
//                   type="text"
//                   id="dropoffLocation"
//                   placeholder="Enter drop-off location"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="rideDate" className="block text-sm font-medium text-gray-700">
//                   Ride Date
//                 </label>
//                 <input
//                   type="date"
//                   id="rideDate"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="rideTime" className="block text-sm font-medium text-gray-700">
//                   Ride Time
//                 </label>
//                 <input
//                   type="time"
//                   id="rideTime"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">
//                   Available Seats
//                 </label>
//                 <input
//                   type="number"
//                   id="availableSeats"
//                   placeholder="Enter number of seats"
//                   min="1"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//             </>
//           )}

//           {/* Fields for Sell Item */}
//           {category === "SELL" && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   placeholder="Enter listing title"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
//                   Item Name
//                 </label>
//                 <input
//                   type="text"
//                   id="itemName"
//                   placeholder="Enter item name"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <textarea
//                   id="itemDescription"
//                   placeholder="Enter item description"
//                   rows={3}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   id="itemPrice"
//                   placeholder="Enter price"
//                   min="0"
//                   step="0.01"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
//                   Sub Category
//                 </label>
//                 <select
//                   id="subCategory"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                 >
//                   <option value="">Select sub-category</option>
//                   <option value="FURNITURE">Furniture</option>
//                   <option value="ELECTRONICS">Electronics</option>
//                   <option value="CLOTHING">Clothing</option>
//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="uploadImagesSell" className="block text-sm font-medium text-gray-700">
//                   Upload Images
//                 </label>
//                 <input
//                   type="file"
//                   id="uploadImagesSell"
//                   multiple
//                   accept="image/*"
//                   className="mt-1 block w-full text-sm text-gray-500"
//                 />
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Submit
//           </button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
