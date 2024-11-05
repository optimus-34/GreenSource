import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface CustomerProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
}

const ConsumerProfilePage: React.FC = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerProfile>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    addresses: []
  });
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false
  });

  // Get user email from localStorage
  const user = localStorage.getItem('user');
  const userEmail = user ? JSON.parse(user).email : null;

  const fetchCustomerProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/customers/${userEmail}`);
      const profileData = response.data.data;
      setCustomerData({
        email: profileData.email || '',
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phone: profileData.phone || '',
        addresses: profileData.addresses || []
      });
    } catch (error) {
      console.error("Error fetching customer profile:", error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchCustomerProfile();
    }
  }, [userEmail]);

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/customers/${userEmail}`, {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone
      });
      
      setCustomerData({
        ...customerData,
        ...response.data
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/customers/${userEmail}/addresses`, newAddress);
      const newAddressWithId = response.data.data;
      
      // Fetch updated profile data to ensure we have the latest state
      await fetchCustomerProfile();
      
      setIsAddingAddress(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isDefault: false
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this address?");
    
    if (!isConfirmed) {
      return;
    }

    try {
      // Call the delete address endpoint
      await axios.delete(`http://localhost:3001/api/customers/${userEmail}/addresses/${addressId}`);
      
      // Fetch updated profile data to ensure we have the latest state
      await fetchCustomerProfile();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (!customerData.email) {
    return <div>Loading...</div>;
  }
  console.log(customerData.addresses);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">{customerData.firstName} {customerData.lastName}</h1>
            <p className="text-gray-500">{customerData.email}</p>
            {customerData.phone && <p className="text-gray-500">{customerData.phone}</p>}
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
                  value={customerData.firstName}
                  onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                  disabled={!isEditingProfile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-transparent disabled:border-transparent"
                  placeholder="Last Name"
                  value={customerData.lastName}
                  onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                  disabled={!isEditingProfile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-transparent disabled:border-transparent"
                  placeholder="Phone Number"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  disabled={!isEditingProfile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerData.email}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Addresses</h2>
              <button
                className="text-sm bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                onClick={() => setIsAddingAddress(true)}
              >
                Add New Address
              </button>
            </div>

            {/* Existing Addresses */}
            <div className="space-y-4">
              {customerData.addresses.map((address) => (
                <div key={address._id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.country}, {address.zipCode}</p>
                      {address.isDefault && (
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
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

export default ConsumerProfilePage;
