import React from "react";
import { Card, Label, TextInput } from "flowbite-react";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ShippingAddressForm({ formData, setFormData }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <FaMapMarkerAlt className="h-5 w-5" />
        <h2 className="text-xl font-bold">Shipping Address</h2>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" value="First Name" />
            <TextInput
              id="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" value="Last Name" />
            <TextInput
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput
              id="phone"
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="address1" value="Address Line 1" />
            <TextInput
              id="address1"
              type="text"
              placeholder="Address Line 1"
              value={formData.address1}
              onChange={(e) =>
                setFormData({ ...formData, address1: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="address2" value="Address Line 2" />
            <TextInput
              id="address2"
              type="text"
              placeholder="Address Line 2"
              value={formData.address2}
              onChange={(e) =>
                setFormData({ ...formData, address2: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="city" value="City" />
            <TextInput
              id="city"
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="state" value="State" />
            <TextInput
              id="state"
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="pin" value="Pincode" />
            <TextInput
              id="pin"
              type="text"
              placeholder="Pin Code"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="country" value="Country" />
            <TextInput
              id="country"
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              required
            />
          </div>
        </div>
      </form>
    </Card>
  );
}
