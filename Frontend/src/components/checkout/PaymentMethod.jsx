import React from "react";
import { Card } from "flowbite-react";
import { FaCreditCard, FaMoneyBill } from "react-icons/fa";

export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <FaCreditCard className="h-5 w-5" />
        <h2 className="text-xl font-bold">Payment Method</h2>
      </div>
      <div className="space-y-4">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-purple-600"
          />
          <FaMoneyBill className="ml-3 h-5 w-5 text-gray-400" />
          <span className="ml-3">Cash on Delivery</span>
        </label>
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="text-purple-600"
          />
          <FaCreditCard className="ml-3 h-5 w-5 text-gray-400" />
          <span className="ml-3">Online Payment</span>
        </label>
      </div>
    </Card>
  );
}
