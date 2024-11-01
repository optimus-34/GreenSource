import React, { useState, useEffect } from "react";
import { Delete } from "lucide-react";
import axios from "axios";

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  lastFourDigits: string;
  expiryDate: string;
}

const ConsumerProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customer");
        setProfile(response.data.profile);
        setAddresses(response.data.addresses);
        setPaymentMethods(response.data.paymentMethods);
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await axios.put("/api/consumer/profile", profile);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.post("/api/consumer/addresses", newAddress);
      setAddresses([...addresses, response.data]);
      setNewAddress({ street: "", city: "", state: "", zipCode: "" });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await axios.delete(`/api/consumer/addresses/${id}`);
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Consumer Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Name"
              value={profile.name}
              disabled={!isEditingProfile}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              type="email"
              placeholder="Email"
              value={profile.email}
              disabled={!isEditingProfile}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
          {isEditingProfile && (
            <div>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="New Password"
                value={profile.password}
                onChange={(e) =>
                  setProfile({ ...profile, password: e.target.value })
                }
              />
            </div>
          )}
          <div>
            {isEditingProfile ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.zipCode}
                </p>
                <button
                  className="text-red-500 hover:text-red-700"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zipCode: e.target.value })
                  }
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleAddAddress}
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">
                    {method.type} ending in {method.lastFourDigits}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires: {method.expiryDate}
                  </p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <Delete />
                </button>
              </div>
            </div>
          ))}
          <button className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50">
            Add New Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfilePage;
