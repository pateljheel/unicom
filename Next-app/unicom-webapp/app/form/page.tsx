// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/lib/AuthContext";

// export default function ListingForm() {
//   const [category, setCategory] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const router = useRouter();
//   const { token, isAuthenticated } = useAuth();
//   const API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts";

//   useEffect(() => {
//     console.log("Token from context:", token);
//     console.log("Is authenticated:", isAuthenticated);
//   }, [token, isAuthenticated]);

//   const toBase64 = (file: File): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve((reader.result as string).split(",")[1]); // Remove the "data:image..." prefix
//       reader.onerror = (error) => reject(error);
//     });

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};
    
//     // Common validations
//     if (category === "") {
//       newErrors.category = "Please select a category";
//     }

//     // Category-specific validations
//     if (category === "ROOMMATE") {
//       const description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
//       const apartmentName = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
//       const dateAvailability = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
      
//       if (!description) {
//         newErrors.description = "Description is required";
//       }
      
//       if (!apartmentName) {
//         newErrors.apartmentName = "Community/apartment name is required";
//       }
      
//       if (!dateAvailability) {
//         newErrors.dateAvailability = "Start date is required";
//       } else {
//         // Validate date format
//         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//         if (!dateRegex.test(dateAvailability)) {
//           newErrors.dateAvailability = "Invalid date format (YYYY-MM-DD)";
//         }
//       }
//     } else if (category === "CARPOOL") {
//       const pickupLocation = (document.getElementById("pickupLocation") as HTMLInputElement)?.value;
//       const dropoffLocation = (document.getElementById("dropoffLocation") as HTMLInputElement)?.value;
//       const rideDate = (document.getElementById("rideDate") as HTMLInputElement)?.value;
//       const rideTime = (document.getElementById("rideTime") as HTMLInputElement)?.value;
//       const availableSeats = (document.getElementById("availableSeats") as HTMLInputElement)?.value;
      
//       if (!pickupLocation) {
//         newErrors.pickupLocation = "Pickup location is required";
//       }
      
//       if (!dropoffLocation) {
//         newErrors.dropoffLocation = "Drop-off location is required";
//       }
      
//       if (!rideDate) {
//         newErrors.rideDate = "Ride date is required";
//       }
      
//       if (!rideTime) {
//         newErrors.rideTime = "Ride time is required";
//       }
      
//       if (!availableSeats || parseInt(availableSeats) < 1) {
//         newErrors.availableSeats = "At least 1 seat must be available";
//       } else if (!Number.isInteger(Number(availableSeats))) {
//         newErrors.availableSeats = "Seats must be a whole number";
//       }
//     } else if (category === "SELL") {
//       const title = (document.getElementById("title") as HTMLInputElement)?.value;
//       const itemName = (document.getElementById("itemName") as HTMLInputElement)?.value;
//       const itemDescription = (document.getElementById("itemDescription") as HTMLTextAreaElement)?.value;
//       const itemPrice = (document.getElementById("itemPrice") as HTMLInputElement)?.value;
//       const subCategory = (document.getElementById("subCategory") as HTMLSelectElement)?.value;
      
//       if (!title) {
//         newErrors.title = "Title is required";
//       }
      
//       if (!itemName) {
//         newErrors.itemName = "Item name is required";
//       }
      
//       if (!itemDescription) {
//         newErrors.itemDescription = "Item description is required";
//       }
      
//       if (!itemPrice) {
//         newErrors.itemPrice = "Price is required";
//       } else if (isNaN(parseFloat(itemPrice)) || parseFloat(itemPrice) < 0) {
//         newErrors.itemPrice = "Price must be a positive number";
//       }
      
//       if (!subCategory) {
//         newErrors.subCategory = "Sub-category is required";
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token || !isAuthenticated) {
//       alert("You are not authenticated. Please log in again.");
//       router.push("/login");
//       return;
//     }

//     // Validate form before submission
//     if (!validateForm()) {
//       console.log("Form validation failed:", errors);
//       return;
//     }

//     const formData: any = {
//       category: "",
//       title: "",
//       description: "",
//       images: [],
//     };

//     let images: string[] = [];

//     if (category === "ROOMMATE") {
//       formData.category = "ROOMMATE";
//       formData.title = "Looking for a roommate"; // Default title
//       formData.description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
//       formData.community = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
//       formData.start_date = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
//       formData.rent = parseFloat((document.getElementById("rent") as HTMLInputElement)?.value || "0");
//       formData.general_preferences = (document.getElementById("generalPreferences") as HTMLSelectElement)?.value || "ANY";
//       formData.gender_preference = (document.getElementById("genderPreference") as HTMLSelectElement)?.value || "ANY";
      
//       const files = (document.getElementById("uploadImagesRoommate") as HTMLInputElement)?.files;
//       if (files) {
//         for (let i = 0; i < files.length; i++) {
//           const base64 = await toBase64(files[i]);
//           images.push(base64);
//         }
//       }
//     } else if (category === "CARPOOL") {
//       formData.category = "CARPOOL";
//       formData.title = "Carpool ride available"; // Default title
//       formData.description = "Offering a carpool ride";
//       formData.from_location = (document.getElementById("pickupLocation") as HTMLInputElement)?.value;
//       formData.to_location = (document.getElementById("dropoffLocation") as HTMLInputElement)?.value;
//       const date = (document.getElementById("rideDate") as HTMLInputElement)?.value;
//       const time = (document.getElementById("rideTime") as HTMLInputElement)?.value;
//       formData.departure_time = `${date}T${time}:00`;
//       formData.seats_available = parseInt(
//         (document.getElementById("availableSeats") as HTMLInputElement)?.value || "1"
//       );
//     } else if (category === "SELL") {
//       formData.category = "SELL";
//       formData.title = (document.getElementById("title") as HTMLInputElement)?.value;
//       formData.description = (document.getElementById("itemDescription") as HTMLTextAreaElement)?.value;
//       formData.item = (document.getElementById("itemName") as HTMLInputElement)?.value;
//       formData.price = parseFloat(
//         (document.getElementById("itemPrice") as HTMLInputElement)?.value || "0"
//       );
//       formData.sub_category = (document.getElementById("subCategory") as HTMLSelectElement)?.value || "OTHER";

//       const files = (document.getElementById("uploadImagesSell") as HTMLInputElement)?.files;
//       if (files) {
//         for (let i = 0; i < files.length; i++) {
//           const base64 = await toBase64(files[i]);
//           images.push(base64);
//         }
//       }
//     } else {
//       alert("Please select a valid category.");
//       return;
//     }

//     formData.images = images;

//     console.log("Payload:", formData);

//     try {
//       const headers: HeadersInit = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       };

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       console.log("Response Status:", response.status);

//       if (response.status === 202) {
//         alert("Listing submitted successfully and is under moderation!");
//         router.push("/buttons"); // Adjust as needed
//       } else {
//         alert("Error: " + (result.error || "Unknown error occurred"));
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//       alert("Something went wrong while submitting the post.");
//     }
//   };

//   // Helper function to display error message
//   const renderError = (field: string) => {
//     return errors[field] ? (
//       <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
//     ) : null;
//   };

//   return (
//     <Card className="max-w-md mx-auto mt-10">
//       <CardHeader>
//         <CardTitle>Create Listing</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               id="category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className={`mt-1 block w-full border ${
//                 errors.category ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
//             >
//               <option value="">Select a category</option>
//               <option value="ROOMMATE">Roommate finder</option>
//               <option value="CARPOOL">Carpool</option>
//               <option value="SELL">Sell Item</option>
//             </select>
//             {renderError("category")}
//           </div>

//           {/* Fields for Roommate */}
//           {category === "ROOMMATE" && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <textarea 
//                   id="description" 
//                   rows={3} 
//                   className={`mt-1 block w-full border ${
//                     errors.description ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("description")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="apartmentName" className="block text-sm font-medium text-gray-700">
//                   Community
//                 </label>
//                 <input 
//                   type="text" 
//                   id="apartmentName" 
//                   className={`mt-1 block w-full border ${
//                     errors.apartmentName ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("apartmentName")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="dateAvailability" className="block text-sm font-medium text-gray-700">
//                   Start Date
//                 </label>
//                 <input 
//                   type="date" 
//                   id="dateAvailability" 
//                   className={`mt-1 block w-full border ${
//                     errors.dateAvailability ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("dateAvailability")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
//                   Rent
//                 </label>
//                 <input 
//                   type="number" 
//                   id="rent" 
//                   min="0" 
//                   step="0.01" 
//                   defaultValue="1000" 
//                   className={`mt-1 block w-full border ${
//                     errors.rent ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("rent")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="generalPreferences" className="block text-sm font-medium text-gray-700">
//                   General Preferences
//                 </label>
//                 <select
//                   id="generalPreferences"
//                   className={`mt-1 block w-full border ${
//                     errors.generalPreferences ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
//                 >
//                   <option value="ANY">Any</option>
//                   <option value="NON_SMOKER">Non-smoker</option>
//                   <option value="QUIET">Quiet</option>
//                   <option value="CLEAN">Clean</option>
//                 </select>
//                 {renderError("generalPreferences")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="genderPreference" className="block text-sm font-medium text-gray-700">
//                   Gender Preference
//                 </label>
//                 <select
//                   id="genderPreference"
//                   className={`mt-1 block w-full border ${
//                     errors.genderPreference ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
//                 >
//                   <option value="ANY">Any</option>
//                   <option value="MALE">Male</option>
//                   <option value="FEMALE">Female</option>
//                 </select>
//                 {renderError("genderPreference")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="uploadImagesRoommate" className="block text-sm font-medium text-gray-700">
//                   Upload Images
//                 </label>
//                 <input type="file" id="uploadImagesRoommate" multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
//               </div>
//             </>
//           )}

//           {/* Fields for Carpool */}
//           {category === "CARPOOL" && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
//                   Pickup Location
//                 </label>
//                 <input
//                   type="text"
//                   id="pickupLocation"
//                   placeholder="Enter pickup location"
//                   className={`mt-1 block w-full border ${
//                     errors.pickupLocation ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 />
//                 {renderError("pickupLocation")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
//                   Drop-off Location
//                 </label>
//                 <input
//                   type="text"
//                   id="dropoffLocation"
//                   placeholder="Enter drop-off location"
//                   className={`mt-1 block w-full border ${
//                     errors.dropoffLocation ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 />
//                 {renderError("dropoffLocation")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="rideDate" className="block text-sm font-medium text-gray-700">
//                   Ride Date
//                 </label>
//                 <input 
//                   type="date" 
//                   id="rideDate" 
//                   className={`mt-1 block w-full border ${
//                     errors.rideDate ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("rideDate")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="rideTime" className="block text-sm font-medium text-gray-700">
//                   Ride Time
//                 </label>
//                 <input 
//                   type="time" 
//                   id="rideTime" 
//                   className={`mt-1 block w-full border ${
//                     errors.rideTime ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("rideTime")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">
//                   Available Seats
//                 </label>
//                 <input 
//                   type="number" 
//                   id="availableSeats" 
//                   min="1" 
//                   defaultValue="1" 
//                   className={`mt-1 block w-full border ${
//                     errors.availableSeats ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
//                 />
//                 {renderError("availableSeats")}
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
//                   className={`mt-1 block w-full border ${
//                     errors.title ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 />
//                 {renderError("title")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
//                   Item Name
//                 </label>
//                 <input
//                   type="text"
//                   id="itemName"
//                   placeholder="Enter item name"
//                   className={`mt-1 block w-full border ${
//                     errors.itemName ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 />
//                 {renderError("itemName")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
//                   Item Description
//                 </label>
//                 <textarea
//                   id="itemDescription"
//                   rows={3}
//                   placeholder="Enter item description"
//                   className={`mt-1 block w-full border ${
//                     errors.itemDescription ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 />
//                 {renderError("itemDescription")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   id="itemPrice"
//                   min="0"
//                   step="0.01"
//                   placeholder="Enter price"
//                   className={`mt-1 block w-full border ${
//                     errors.itemPrice ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 />
//                 {renderError("itemPrice")}
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
//                   Sub Category
//                 </label>
//                 <select
//                   id="subCategory"
//                   className={`mt-1 block w-full border ${
//                     errors.subCategory ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
//                 >
//                   <option value="FURNITURE">Furniture</option>
//                   <option value="ELECTRONICS">Electronics</option>
//                   <option value="KITCHEN">Kitchen</option>
//                   <option value="BOOKS">Books</option>
//                   <option value="OTHER">Other</option>
//                 </select>
//                 {renderError("subCategory")}
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
//             className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
//           >
//             Submit
//           </button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }




"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";

export default function ListingForm() {
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [customPreference, setCustomPreference] = useState("");
  const [customPreferences, setCustomPreferences] = useState<string[]>([]);
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com/api/posts";

  useEffect(() => {
    console.log("Token from context:", token);
    console.log("Is authenticated:", isAuthenticated);
  }, [token, isAuthenticated]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handlePreferenceToggle = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleAddCustomPreference = () => {
    if (customPreference.trim() && !customPreferences.includes(customPreference.trim())) {
      setCustomPreferences([...customPreferences, customPreference.trim()]);
      setCustomPreference("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (category === "") {
      newErrors.category = "Please select a category";
    }

    if (category === "ROOMMATE") {
      const description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
      const apartmentName = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
      const dateAvailability = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
      const rent = (document.getElementById("rent") as HTMLInputElement)?.value;
      
      if (!description) {
        newErrors.description = "Description is required";
      }
      
      if (!apartmentName) {
        newErrors.apartmentName = "Community/apartment name is required";
      }
      
      if (!dateAvailability) {
        newErrors.dateAvailability = "Start date is required";
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateAvailability)) {
          newErrors.dateAvailability = "Invalid date format (YYYY-MM-DD)";
        }
      }

      if (!rent) {
        newErrors.rent = "Rent is required";
      } else if (isNaN(parseFloat(rent)) || parseFloat(rent) < 0) {
        newErrors.rent = "Rent must be a positive number";
      }
    } else if (category === "CARPOOL") {
      const pickupLocation = (document.getElementById("pickupLocation") as HTMLInputElement)?.value;
      const dropoffLocation = (document.getElementById("dropoffLocation") as HTMLInputElement)?.value;
      const rideDate = (document.getElementById("rideDate") as HTMLInputElement)?.value;
      const rideTime = (document.getElementById("rideTime") as HTMLInputElement)?.value;
      const availableSeats = (document.getElementById("availableSeats") as HTMLInputElement)?.value;
      
      if (!pickupLocation) {
        newErrors.pickupLocation = "Pickup location is required";
      }
      
      if (!dropoffLocation) {
        newErrors.dropoffLocation = "Drop-off location is required";
      }
      
      if (!rideDate) {
        newErrors.rideDate = "Ride date is required";
      }
      
      if (!rideTime) {
        newErrors.rideTime = "Ride time is required";
      }
      
      if (!availableSeats || parseInt(availableSeats) < 1) {
        newErrors.availableSeats = "At least 1 seat must be available";
      } else if (!Number.isInteger(Number(availableSeats))) {
        newErrors.availableSeats = "Seats must be a whole number";
      }
    } else if (category === "SELL") {
      const title = (document.getElementById("title") as HTMLInputElement)?.value;
      const itemName = (document.getElementById("itemName") as HTMLInputElement)?.value;
      const itemDescription = (document.getElementById("itemDescription") as HTMLTextAreaElement)?.value;
      const itemPrice = (document.getElementById("itemPrice") as HTMLInputElement)?.value;
      const subCategory = (document.getElementById("subCategory") as HTMLSelectElement)?.value;
      
      if (!title) {
        newErrors.title = "Title is required";
      }
      
      if (!itemName) {
        newErrors.itemName = "Item name is required";
      }
      
      if (!itemDescription) {
        newErrors.itemDescription = "Item description is required";
      }
      
      if (!itemPrice) {
        newErrors.itemPrice = "Price is required";
      } else if (isNaN(parseFloat(itemPrice)) || parseFloat(itemPrice) < 0) {
        newErrors.itemPrice = "Price must be a positive number";
      }
      
      if (!subCategory) {
        newErrors.subCategory = "Sub-category is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !isAuthenticated) {
      alert("You are not authenticated. Please log in again.");
      router.push("/login");
      return;
    }

    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    const formData: any = {
      category: "",
      title: "",
      description: "",
      images: [],
    };

    let images: string[] = [];

    if (category === "ROOMMATE") {
      formData.category = "ROOMMATE";
      formData.title = "Looking for a roommate";
      formData.description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
      formData.community = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
      formData.start_date = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
      formData.rent = parseFloat((document.getElementById("rent") as HTMLInputElement)?.value || "0");
      formData.preferences = [...selectedPreferences, ...customPreferences];
      formData.gender_preference = (document.getElementById("genderPreference") as HTMLSelectElement)?.value || "ANY";
      
      const files = (document.getElementById("uploadImagesRoommate") as HTMLInputElement)?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const base64 = await toBase64(files[i]);
          images.push(base64);
        }
      }
    } else if (category === "CARPOOL") {
      formData.category = "CARPOOL";
      formData.title = "Carpool ride available";
      formData.description = "Offering a carpool ride";
      formData.from_location = (document.getElementById("pickupLocation") as HTMLInputElement)?.value;
      formData.to_location = (document.getElementById("dropoffLocation") as HTMLInputElement)?.value;
      const date = (document.getElementById("rideDate") as HTMLInputElement)?.value;
      const time = (document.getElementById("rideTime") as HTMLInputElement)?.value;
      formData.departure_time = `${date}T${time}:00`;
      formData.seats_available = parseInt(
        (document.getElementById("availableSeats") as HTMLInputElement)?.value || "1"
      );
    } else if (category === "SELL") {
      formData.category = "SELL";
      formData.title = (document.getElementById("title") as HTMLInputElement)?.value;
      formData.description = (document.getElementById("itemDescription") as HTMLTextAreaElement)?.value;
      formData.item = (document.getElementById("itemName") as HTMLInputElement)?.value;
      formData.price = parseFloat(
        (document.getElementById("itemPrice") as HTMLInputElement)?.value || "0"
      );
      formData.sub_category = (document.getElementById("subCategory") as HTMLSelectElement)?.value || "OTHER";

      const files = (document.getElementById("uploadImagesSell") as HTMLInputElement)?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const base64 = await toBase64(files[i]);
          images.push(base64);
        }
      }
    } else {
      alert("Please select a valid category.");
      return;
    }

    formData.images = images;

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

  const renderError = (field: string) => {
    return errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            >
              <option value="">Select a category</option>
              <option value="ROOMMATE">Roommate finder</option>
              <option value="CARPOOL">Carpool</option>
              <option value="SELL">Sell Item</option>
            </select>
            {renderError("category")}
          </div>

          {category === "ROOMMATE" && (
            <>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea 
                  id="description" 
                  rows={3} 
                  className={`mt-1 block w-full border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("description")}
              </div>
              <div className="mb-4">
                <label htmlFor="apartmentName" className="block text-sm font-medium text-gray-700">
                  Community
                </label>
                <input 
                  type="text" 
                  id="apartmentName" 
                  className={`mt-1 block w-full border ${
                    errors.apartmentName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("apartmentName")}
              </div>
              <div className="mb-4">
                <label htmlFor="dateAvailability" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input 
                  type="date" 
                  id="dateAvailability" 
                  className={`mt-1 block w-full border ${
                    errors.dateAvailability ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("dateAvailability")}
              </div>
              <div className="mb-4">
                <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                  Rent
                </label>
                <input 
                  type="number" 
                  id="rent" 
                  min="0" 
                  step="0.01" 
                  defaultValue="1000" 
                  className={`mt-1 block w-full border ${
                    errors.rent ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("rent")}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Preferences
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handlePreferenceToggle("Non-smoker")}
                    className={`px-3 py-1 rounded-full border ${
                      selectedPreferences.includes("Non-smoker")
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Non-smoker
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreferenceToggle("Pet-friendly")}
                    className={`px-3 py-1 rounded-full border ${
                      selectedPreferences.includes("Pet-friendly")
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Pet-friendly
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreferenceToggle("Cooking-enthusiast")}
                    className={`px-3 py-1 rounded-full border ${
                      selectedPreferences.includes("Cooking-enthusiast")
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Cooking-enthusiast
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Add Custom Preference
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    placeholder="Enter custom preference"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPreference}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                {customPreferences.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {customPreferences.map((pref, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="genderPreference" className="block text-sm font-medium text-gray-700">
                  Gender Preference
                </label>
                <select
                  id="genderPreference"
                  className={`mt-1 block w-full border ${
                    errors.genderPreference ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                >
                  <option value="ANY">Any</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                {renderError("genderPreference")}
              </div>
              <div className="mb-4">
                <label htmlFor="uploadImagesRoommate" className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input type="file" id="uploadImagesRoommate" multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
              </div>
            </>
          )}

          {category === "CARPOOL" && (
            <>
              <div className="mb-4">
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  placeholder="Enter pickup location"
                  className={`mt-1 block w-full border ${
                    errors.pickupLocation ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                />
                {renderError("pickupLocation")}
              </div>
              <div className="mb-4">
                <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                  Drop-off Location
                </label>
                <input
                  type="text"
                  id="dropoffLocation"
                  placeholder="Enter drop-off location"
                  className={`mt-1 block w-full border ${
                    errors.dropoffLocation ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                />
                {renderError("dropoffLocation")}
              </div>
              <div className="mb-4">
                <label htmlFor="rideDate" className="block text-sm font-medium text-gray-700">
                  Ride Date
                </label>
                <input 
                  type="date" 
                  id="rideDate" 
                  className={`mt-1 block w-full border ${
                    errors.rideDate ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("rideDate")}
              </div>
              <div className="mb-4">
                <label htmlFor="rideTime" className="block text-sm font-medium text-gray-700">
                  Ride Time
                </label>
                <input 
                  type="time" 
                  id="rideTime" 
                  className={`mt-1 block w-full border ${
                    errors.rideTime ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("rideTime")}
              </div>
              <div className="mb-4">
                <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input 
                  type="number" 
                  id="availableSeats" 
                  min="1" 
                  defaultValue="1" 
                  className={`mt-1 block w-full border ${
                    errors.availableSeats ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`} 
                />
                {renderError("availableSeats")}
              </div>
            </>
          )}

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
                  className={`mt-1 block w-full border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                />
                {renderError("title")}
              </div>
              <div className="mb-4">
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  placeholder="Enter item name"
                  className={`mt-1 block w-full border ${
                    errors.itemName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                />
                {renderError("itemName")}
              </div>
              <div className="mb-4">
                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
                  Item Description
                </label>
                <textarea
                  id="itemDescription"
                  rows={3}
                  placeholder="Enter item description"
                  className={`mt-1 block w-full border ${
                    errors.itemDescription ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                />
                {renderError("itemDescription")}
              </div>
              <div className="mb-4">
                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="itemPrice"
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  className={`mt-1 block w-full border ${
                    errors.itemPrice ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                />
                {renderError("itemPrice")}
              </div>
              <div className="mb-4">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Sub Category
                </label>
                <select
                  id="subCategory"
                  className={`mt-1 block w-full border ${
                    errors.subCategory ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                >
                  <option value="FURNITURE">Furniture</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="KITCHEN">Kitchen</option>
                  <option value="BOOKS">Books</option>
                  <option value="OTHER">Other</option>
                </select>
                {renderError("subCategory")}
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
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </CardContent>
    </Card>
  );
}