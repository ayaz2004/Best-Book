import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTag, FaTimes, FaCheck } from "react-icons/fa";
import { fetchCart } from "../redux/cart/cartSlice";

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCart());
    }
  }, [dispatch, currentUser]);

  const handleApplyCoupon = async () => {
    try {
      await dispatch(applyCoupon(couponCode)).unwrap();
      setCouponError("");
    } catch (error) {
      setCouponError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="p-2 border rounded"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  className="w-full p-2 border rounded"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="p-2 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="p-2 border rounded"
                  />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" className="form-radio" />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" className="form-radio" />
                  <span>Online Payment</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{orderSummary?.subtotal || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{orderSummary?.shipping || 0}</span>
                </div>
                {orderSummary?.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{orderSummary.discount}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{orderSummary?.total || 0}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mt-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={loading || !couponCode}
                    className={`px-4 py-2 rounded ${
                      loading || !couponCode
                        ? "bg-gray-300"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Applying
                      </span>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>

              <button
                onClick={() => {
                  /* Handle checkout */
                }}
                className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
