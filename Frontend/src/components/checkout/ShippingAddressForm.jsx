import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Radio, Button, TextInput, Label } from "flowbite-react";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
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
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="h-5 w-5" />
          <h2 className="text-xl font-bold">Select Delivery Address</h2>
        </div>
        <Button
          color="purple"
          size="sm"
          onClick={handleNewAddressClick}
          disabled={showNewAddressForm}
        >
          <FaPlus className="mr-2" />
          Use New Address
        </Button>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="text-center text-gray-600">Loading addresses...</div>
        )}

        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}

        {!showNewAddressForm ? (
          <>
            {!loading && addresses.length === 0 && (
              <div className="text-center p-4 border rounded-lg">
                <p className="text-gray-600 mb-2">No saved addresses found</p>
                <p className="text-sm text-gray-500">
                  You can add a new address for this order
                </p>
              </div>
            )}

            {!loading &&
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAddressId === addr._id
                      ? "border-purple-600 bg-purple-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleAddressSelect(addr)}
                >
                  <div className="flex items-start gap-3">
                    <Radio
                      name="address"
                      checked={selectedAddressId === addr._id}
                      onChange={() => handleAddressSelect(addr)}
                    />
                    <div>
                      <p className="font-medium">
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
                </div>
              ))}
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <TextInput
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <TextInput
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <TextInput
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <TextInput
                  id="address1"
                  value={formData.address1}
                  onChange={(e) =>
                    setFormData({ ...formData, address1: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <TextInput
                  id="address2"
                  value={formData.address2}
                  onChange={(e) =>
                    setFormData({ ...formData, address2: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <TextInput
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <TextInput
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <TextInput
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <Button
              color="light"
              onClick={() => {
                setShowNewAddressForm(false);
                if (addresses.length > 0) {
                  setSelectedAddressId(addresses[0]._id);
                  setFormData(addresses[0]);
                }
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
