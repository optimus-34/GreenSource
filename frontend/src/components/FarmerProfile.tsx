import React, { useState, useEffect } from "react";
import { Delete } from "lucide-react";
import axios from "axios";
import { selectAuth } from "../store/slices/authSlice";
import { useSelector } from "react-redux";

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const FarmerProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "", 
    email: "",
    phone: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { user, token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/farmers/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token ? token : ""}`,
            },
            data: {
              email: user.email,
            },
          }
        );
        setProfile(response.data.profile);
        setAddresses(response.data.addresses);
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [token, user.email]);

  const handleProfileUpdate = async () => {
    try {
      await axios.put("/api/farmers/profile", profile);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.post("/api/farmers/addresses", newAddress);
      setAddresses([...addresses, response.data]);
      setNewAddress({ street: "", city: "", state: "", zipCode: "" });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await axios.delete(`/api/farmers/addresses/${id}`);
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Farmer Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              placeholder="First Name"
              value={profile.first_name}
              disabled={!isEditingProfile}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            />
          </div>
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              placeholder="Last Name"
              value={profile.last_name}
              disabled={!isEditingProfile}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            />
          </div>
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              type="email"
              placeholder="Email"
              value={profile.email}
              disabled={!isEditingProfile}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              type="tel"
              placeholder="Phone"
              value={profile.phone}
              disabled={!isEditingProfile}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            {isEditingProfile ? (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transform transition-all duration-300 hover:scale-[1.02]"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-50 transform transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Farm Addresses</h2>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-gray-50 rounded-md p-4 transform transition-all duration-300 hover:scale-[1.01]">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </p>
                <button
                  className="text-red-500 hover:text-red-700 transform transition-all duration-300 hover:scale-110"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Delete />
                </button>
              </div>
            </div>
          ))}
          <div>
            <h3 className="text-lg font-medium mb-3">Add New Address</h3>
            <div className="space-y-4">
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                />
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transform transition-all duration-300 hover:scale-[1.02]"
                onClick={handleAddAddress}
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
