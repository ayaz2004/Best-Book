import React from "react";
import { Card, Radio, Label } from "flowbite-react";
import { FaTruck } from "react-icons/fa";

export default function DeliveryOptions({
  selectedDelivery,
  setSelectedDelivery,
  deliveryOptions,
}) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <FaTruck className="h-5 w-5" />
        <h2 className="text-xl font-bold">Delivery Method</h2>
      </div>
      <div className="space-y-4">
        {deliveryOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedDelivery === option.id
                ? "border-purple-600 bg-purple-50"
                : ""
            }`}
            onClick={() => setSelectedDelivery(option.id)}
          >
            <Radio
              id={option.id}
              name="delivery"
              value={option.id}
              checked={selectedDelivery === option.id}
              onChange={() => setSelectedDelivery(option.id)}
            />
            <Label
              htmlFor={option.id}
              className="ml-2 flex justify-between items-center w-full"
            >
              <div className="flex items-center gap-4">
                <option.icon className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-gray-600">{option.time}</p>
                </div>
              </div>
              <p className="font-medium">₹{option.price}</p>
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
}
