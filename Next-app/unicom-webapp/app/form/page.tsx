"use client";

import { useState, useEffect } from 'react';

export default function FindRoommates() {
  const [preferences, setPreferences] = useState([
    { label: 'Non-smoker', emoji: '😊', selected: false },
    { label: 'Pet-friendly', emoji: '🐱', selected: false },
    { label: 'Cooking enthusiast', emoji: '🔍', selected: false }
  ]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const togglePreference = (index) => {
    setPreferences(prev => prev.map((p, i) =>
      i === index ? { ...p, selected: !p.selected } : p
    ));
  };

  if (!isClient) {
    return null; // Prevents rendering on the server
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-600">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Find Roommates</h2>
        
        <label className="block text-sm font-medium">Apartment Name</label>
        <input type="text" placeholder="Enter Apartment Name" className="w-full p-2 border rounded mb-3" />
        
        <label className="block text-sm font-medium">Date Availability</label>
        <input type="text" placeholder="Enter Date Availability" className="w-full p-2 border rounded mb-3" />
        
        <label className="block text-sm font-medium">Preferences</label>
        <div className="flex gap-2 my-3">
          {preferences.map((pref, index) => (
            <button 
              key={index} 
              className={`px-3 py-2 border rounded flex items-center gap-1 ${pref.selected ? 'bg-gray-300' : ''}`}
              onClick={() => togglePreference(index)}
            >
              {pref.emoji} {pref.label}
            </button>
          ))}
        </div>
        
        <label className="block text-sm font-medium">Description</label>
        <textarea placeholder="Enter Description" className="w-full p-2 border rounded mb-3"></textarea>
        
        <label className="block text-sm font-medium">Upload Image</label>
        <input type="file" className="w-full p-2 border rounded mb-3" />
        
        <button className="w-full bg-black text-white p-3 rounded">Submit</button>
      </div>
    </div>
  );
}




// "use client";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// export default function RoommateForm() {
//   const [form, setForm] = useState({
//     title: "",
//     category: "Find Roommates",
//     apartment: "",
//     description: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCategoryChange = (value) => {
//     setForm({ ...form, category: value });
//   };

//   const handleSubmit = () => {
//     console.log("Form submitted:", form);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
//       {/* Post Form Card with Gradient Background */}
//       <Card className="w-full max-w-lg p-6 rounded-xl shadow-lg bg-gradient-to-r from-orange-500 to-orange-300">
//         <CardContent>
//           <h2 className="text-xl font-semibold text-black mb-4">Create Post</h2>

//           {/* Title Input */}
//           <div className="mb-3">
//             <label className="text-black font-medium">Title:</label>
//             <Input
//               name="title"
//               placeholder="Looking for a pure vegetarian flatmate"
//               value={form.title}
//               onChange={handleChange}
//               className="mt-1 text-black bg-white"
//             />
//           </div>

//           {/* Category Dropdown */}
//           <div className="mb-3">
//             <label className="text-black font-medium">Category:</label>
//             <Select onValueChange={handleCategoryChange} defaultValue={form.category}>
//               <SelectTrigger className="mt-1 bg-white text-black">
//                 <SelectValue placeholder="Category" />
//               </SelectTrigger>
//               <SelectContent className="bg-white text-black">
//                 <SelectItem value="Find Roommates">Find Roommates</SelectItem>
//                 <SelectItem value="Rent an Apartment">Rent an Apartment</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Apartment Name */}
//           <div className="mb-3">
//             <label className="text-black font-medium">Apartment/Community Name:</label>
//             <Input
//               name="apartment"
//               placeholder="Apex Apartment"
//               value={form.apartment}
//               onChange={handleChange}
//               className="mt-1 text-black bg-white"
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <label className="text-black font-medium">Description:</label>
//             <Textarea
//               name="description"
//               placeholder="Looking for a flatmate to share a 2B2B flat, lease starting from 11th July"
//               value={form.description}
//               onChange={handleChange}
//               className="mt-1 text-black bg-white"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4">
//             {/* <Button className="bg-black hover:bg-gray-800 text-white">ADD IMAGE</Button>
//             <Button className="bg-black hover:bg-gray-800 text-white" onClick={handleSubmit}>
//               POST
//             </Button> */}

//                 <Button 
//                 className="bg-black hover:bg-gray-800 text-white rounded-lg py-2 px-6 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 >
//                 ADD IMAGE
//                 </Button>
//                 <Button 
//                 className="bg-black hover:bg-gray-800 text-white rounded-lg py-2 px-6 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 onClick={handleSubmit}
//                 >
//                 POST
//                 </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
