"use client";

import { useState } from "react";
// Adjust these imports to match your shadcn UI setup
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ListingForm() {
  const [category, setCategory] = useState("");

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
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
              <option value="sellItem">Sell Item</option>
            </select>
          </div>

          {/* Fields for Roommate Finder */}
          {category === "roommate" && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  rows="3"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="apartmentName"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="dateAvailability"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Availability
                </label>
                <input
                  type="date"
                  id="dateAvailability"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="preferences"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="uploadImagesRoommate"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="pickupLocation"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="dropoffLocation"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="rideDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ride Date
                </label>
                <input
                  type="date"
                  id="rideDate"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="rideTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ride Time
                </label>
                <input
                  type="time"
                  id="rideTime"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="availableSeats"
                  className="block text-sm font-medium text-gray-700"
                >
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
          {category === "sellItem" && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="itemName"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="itemDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="itemDescription"
                  placeholder="Enter item description"
                  rows="3"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="itemPrice"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="itemCondition"
                  className="block text-sm font-medium text-gray-700"
                >
                  Condition
                </label>
                <select
                  id="itemCondition"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="likeNew">Like New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="uploadImagesSell"
                  className="block text-sm font-medium text-gray-700"
                >
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
