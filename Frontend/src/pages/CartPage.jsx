import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../redux/cart/cartSlice";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, loading, error } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const calculateItemPrice = (item) => {
    const originalPrice = item.price || 0;
    const discount =
      item.type === "ebook" ? item.ebookDiscount : item.hardcopyDiscount;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;
    return {
      original: originalPrice,
      discounted: discountedPrice,
      savings: originalPrice - discountedPrice,
    };
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const { discounted } = calculateItemPrice(item);
      return total + discounted * item.quantity;
    }, 0);
  };

  const calculateTotalSavings = () => {
    return items.reduce((total, item) => {
      const { savings } = calculateItemPrice(item);
      return total + savings * item.quantity;
    }, 0);
  };

  // Loading and error states remain the same...

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section remains the same... */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {items.map((item) => {
                const { original, discounted } = calculateItemPrice(item);
                // Ensure unique key using both productId and type
                const itemKey = `${item._id}-${item.type}`;

                return (
                  <div
                    key={itemKey}
                    className="p-6 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex space-x-6">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-32 h-40 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 capitalize">
                              {item.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-purple-600">
                              ₹{discounted.toFixed(2)}
                            </p>
                            {discounted < original && (
                              <>
                                <p className="text-sm text-gray-500 line-through">
                                  ₹{original.toFixed(2)}
                                </p>
                                <p className="text-sm text-green-600">
                                  Save{" "}
                                  {item.type === "ebook"
                                    ? item.ebookDiscount
                                    : item.hardcopyDiscount}
                                  %
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item._id,
                                    quantity: Math.max(1, item.quantity - 1),
                                  })
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <FaMinus className="text-gray-600" />
                            </button>
                            <span className="px-4 py-2 border-x">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item._id,
                                    quantity: item.quantity + 1,
                                  })
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <FaPlus className="text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                {calculateTotalSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{calculateTotalSavings().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Proceed to Checkout
              </button>
              <Link
                to="/all-books"
                className="block text-center text-purple-600 hover:text-purple-700 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
