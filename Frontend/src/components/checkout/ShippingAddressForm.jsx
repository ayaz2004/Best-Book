import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaPlus, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  addressStart,
  addressSuccess,
  addressFailure,
} from "../../redux/address/addressSlice";

export default function ShippingAddressForm({ formData, setFormData }) {
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const dispatch = useDispatch();
  const {
    address: addressData,
    loading,
    error,
  } = useSelector((state) => state.address);
  const { currentUser } = useSelector((state) => state.user);

  // Extract addresses array from the response
  const addresses = addressData?.addresses || [];

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser?.accessToken) return;

      dispatch(addressStart());
      try {
        const res = await fetch("/api/address/getuseraddresses", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        dispatch(addressSuccess(data));

        // Select first address by default
        if (data.addresses && data.addresses.length > 0 && !selectedAddressId) {
          setSelectedAddressId(data.addresses[0]._id);
          setFormData(data.addresses[0]);
        }
      } catch (error) {
        dispatch(addressFailure(error.message));
      }
    };

    fetchAddresses();
  }, [dispatch, currentUser?.accessToken, selectedAddressId]);

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);
    setFormData(address);
    setShowNewAddressForm(false);
  };

  const handleNewAddressClick = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden"
      whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 px-6 py-4 flex items-center">
        <FaMapMarkerAlt className="text-white mr-2 text-xl" />
        <h2 className="text-lg font-semibold text-white">
          Select Delivery Address
        </h2>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          {showNewAddressForm && addresses.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900"
              onClick={() => {
                setShowNewAddressForm(false);
                if (addresses.length > 0) {
                  setSelectedAddressId(addresses[0]._id);
                  setFormData(addresses[0]);
                }
              }}
            >
              <FaArrowLeft size={14} /> Back to saved addresses
            </motion.button>
          )}
          {!showNewAddressForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-800 to-purple-700 text-white rounded-lg flex items-center gap-2"
              onClick={handleNewAddressClick}
            >
              <FaPlus size={14} /> Use New Address
            </motion.button>
          )}
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          {!showNewAddressForm ? (
            <>
              {!loading && addresses.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed border-purple-200 rounded-xl">
                  <FaMapMarkerAlt className="mx-auto h-10 w-10 text-purple-400 mb-3" />
                  <p className="text-gray-700 font-medium mb-2">
                    No saved addresses found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    You'll need to add a new address for this order
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-800 to-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto"
                    onClick={handleNewAddressClick}
                  >
                    <FaPlus size={14} /> Add New Address
                  </motion.button>
                </div>
              )}

              {!loading &&
                addresses.map((addr) => (
                  <motion.div
                    key={addr._id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedAddressId === addr._id
                        ? "border-blue-600 bg-blue-50"
                        : "border-purple-200 hover:border-purple-300"
                    }`}
                    onClick={() => handleAddressSelect(addr)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                          selectedAddressId === addr._id
                            ? "border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAddressId === addr._id && (
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.address1}
                          {addr.address2 && `, ${addr.address2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state} {addr.pincode}
                        </p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    First Name*
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="John"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="10-digit mobile number"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Address Line 1*
                  </label>
                  <input
                    type="text"
                    value={formData.address1}
                    onChange={(e) =>
                      setFormData({ ...formData, address1: e.target.value })
                    }
                    placeholder="Street address"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.address2}
                    onChange={(e) =>
                      setFormData({ ...formData, address2: e.target.value })
                    }
                    placeholder="Apartment, suite, etc."
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    City*
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="City"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    State*
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="State"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-medium mb-2">
                    Pincode*
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="6-digit PIN code"
                    required
                    className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
              </div>
              {/* {addresses.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mt-2"
                  onClick={() => {
                    setShowNewAddressForm(false);
                    if (addresses.length > 0) {
                      setSelectedAddressId(addresses[0]._id);
                      setFormData(addresses[0]);
                    }
                  }}
                >
                  Cancel
                </motion.button>
              )} */}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
