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

  useEffect(() => {
    console.log("Token from context:", token);
    console.log("Is authenticated:", isAuthenticated);
  }, [token, isAuthenticated]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]); // Remove the "data:image..." prefix
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !isAuthenticated) {
      alert("You are not authenticated. Please log in again.");
      router.push("/login");
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
      formData.title = "Looking for a roommate"; // Default title
      formData.description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
      formData.community = (document.getElementById("apartmentName") as HTMLInputElement)?.value;
      formData.start_date = (document.getElementById("dateAvailability") as HTMLInputElement)?.value;
      formData.rent = 1000; // Hardcoded rent; you can make this dynamic if needed
      formData.general_preferences = "ANY"; // Always safe default
      const files = (document.getElementById("uploadImagesRoommate") as HTMLInputElement)?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const base64 = await toBase64(files[i]);
          images.push(base64);
        }
      }
    } else if (category === "CARPOOL") {
      formData.category = "CARPOOL";
      formData.title = "Carpool ride available"; // Default title
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
        router.push("/buttons"); // Adjust as needed
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
              <option value="ROOMMATE">Roommate finder</option>
              <option value="CARPOOL">Carpool</option>
              <option value="SELL">Sell Item</option>
            </select>
          </div>

          {/* Fields for Roommate */}
          {category === "ROOMMATE" && (
            <>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows={3} className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="apartmentName">Apartment Name</label>
                <input type="text" id="apartmentName" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="dateAvailability">Date Availability</label>
                <input type="date" id="dateAvailability" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="uploadImagesRoommate">Upload Images</label>
                <input type="file" id="uploadImagesRoommate" multiple accept="image/*" />
              </div>
            </>
          )}

          {/* Fields for Carpool */}
          {category === "CARPOOL" && (
            <>
              <div className="mb-4">
                <label htmlFor="pickupLocation">Pickup Location</label>
                <input type="text" id="pickupLocation" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="dropoffLocation">Drop-off Location</label>
                <input type="text" id="dropoffLocation" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="rideDate">Ride Date</label>
                <input type="date" id="rideDate" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="rideTime">Ride Time</label>
                <input type="time" id="rideTime" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="availableSeats">Available Seats</label>
                <input type="number" id="availableSeats" min="1" defaultValue="1" className="mt-1 block w-full" />
              </div>
            </>
          )}

          {/* Fields for Sell Item */}
          {category === "SELL" && (
            <>
              <div className="mb-4">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="itemName">Item Name</label>
                <input type="text" id="itemName" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="itemDescription">Item Description</label>
                <textarea id="itemDescription" rows={3} className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="itemPrice">Price</label>
                <input type="number" id="itemPrice" min="0" step="0.01" className="mt-1 block w-full" />
              </div>
              <div className="mb-4">
                <label htmlFor="subCategory">Sub Category</label>
                <select id="subCategory" className="mt-1 block w-full">
                  <option value="FURNITURE">Furniture</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="KITCHEN">Kitchen</option>
                  <option value="BOOKS">Books</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="uploadImagesSell">Upload Images</label>
                <input type="file" id="uploadImagesSell" multiple accept="image/*" />
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
