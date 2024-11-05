import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";
import { selectAuth } from "../store/slices/authSlice";
import { useSelector } from "react-redux";

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
}

interface FarmerProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: string[]; // Array of address IDs
}

const FarmerProfile: React.FC = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [farmerData, setFarmerData] = useState<FarmerProfile>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    addresses: []
  });
  const [addressesData, setAddressesData] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    is_primary: false
  });

  const { user } = useSelector(selectAuth);

  const fetchAddressDetails = async (addressId: string) => {
    try {
      const response = await axios.get(`http://localhost:3002/api/address/${addressId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching address ${addressId}:`, error);
      return null;
    }
  };

  const fetchFarmerProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/farmers/${user.email}`);
      const profileData = response.data;
      console.log("Profile Data:", profileData); // Debug log
      
      setFarmerData({
        email: profileData.email || '',
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        phone: profileData.phone || '',
        addresses: profileData.addresses || []
      });

      // Fetch all addresses details
      const addressesPromises = profileData.addresses.map((addressId: string) => 
        fetchAddressDetails(addressId)
      );
      const addresses = await Promise.all(addressesPromises);
      setAddressesData(addresses.filter((addr): addr is Address => addr !== null));

    } catch (error) {
      console.error("Error fetching farmer profile:", error);
    }
  };

  useEffect(() => {
    if (user.email) {
      fetchFarmerProfile();
    }
  }, [user.email]);

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`http://localhost:3002/api/farmers/${user.email}/update/name`, {
        firstName: farmerData.firstName,
        lastName: farmerData.lastName
      });
      
      await axios.put(`http://localhost:3002/api/farmers/${user.email}/update/phone`, {
        phone: farmerData.phone
      });
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.put(`http://localhost:3002/api/farmers/${user.email}/addAddress`, newAddress);

      console.log("Add Address Response:", response.data); // Debug log
      
      // Fetch updated profile data to ensure we have the latest state
      await fetchFarmerProfile();
      
      setIsAddingAddress(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        is_primary: false
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      // Show confirmation dialog
      const isConfirmed = window.confirm("Are you sure you want to delete this address?");
      
      if (!isConfirmed) {
        return;
      }

      const url = `http://localhost:3002/api/farmers/${user.email}/delete/address/${addressId}`;
      console.log('Deleting address with URL:', url); // Add this debug log
      
      const response = await axios.delete(url);
      console.log('Delete response:', response.data); // Add this debug log
      
      // Fetch updated profile data to ensure we have the latest state
      await fetchFarmerProfile();
    } catch (error) {
      console.error("Error deleting address:", error);
      // Add more detailed error logging
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
      }
    }
  };

  if (!farmerData.email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">{farmerData.firstName} {farmerData.lastName}</h1>
            <p className="text-gray-500">{farmerData.email}</p>
            {farmerData.phone && <p className="text-gray-500">{farmerData.phone}</p>}
          </div>
          
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Profile Details</h2>
              {isEditingProfile ? (
                <button
                  className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={handleProfileUpdate}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className="text-sm text-blue-500 hover:text-blue-600"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-transparent disabled:border-transparent"
                  placeholder="First Name"
                  value={farmerData.firstName}
                  onChange={(e) => setFarmerData({...farmerData, firstName: e.target.value})}
                  disabled={!isEditingProfile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-transparent disabled:border-transparent"
                  placeholder="Last Name"
                  value={farmerData.lastName}
                  onChange={(e) => setFarmerData({...farmerData, lastName: e.target.value})}
                  disabled={!isEditingProfile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-transparent disabled:border-transparent"
                  placeholder="Phone Number"
                  value={farmerData.phone}
                  onChange={(e) => setFarmerData({...farmerData, phone: e.target.value})}
                  disabled={!isEditingProfile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={farmerData.email}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Farm Addresses</h2>
              <button
                className="text-sm bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                onClick={() => setIsAddingAddress(true)}
              >
                Add New Address
              </button>
            </div>

            {/* Existing Addresses */}
            <div className="space-y-4">
              {addressesData.map((address, index) => (
                <div key={address._id || index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.country}, {address.postal_code}</p>
                      {address.is_primary && (
                        <span className="text-sm text-green-500">Default Address</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(address._id!)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address Form */}
            {isAddingAddress && (
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_primary"
                      checked={newAddress.is_primary}
                      onChange={(e) => setNewAddress({...newAddress, is_primary: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="is_primary" className="text-sm text-gray-700">Set as default address</label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      onClick={() => setIsAddingAddress(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={handleAddAddress}
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
