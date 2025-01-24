import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  // updateCartQuantity,
} from "../redux/cart/cartSlice";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `/api/cart/getcart/678f5e111dad5b2aadaa9f6c`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${currentUser.token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setItems(data.items);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  // const handleUpdateQuantity = (productId, quantity) => {
  //   dispatch(updateCartQuantity({ productId, quantity }));
  // };

  const calculateItemPrice = (item) => {
    const originalPrice = item.product.price || 0;
    const discount =
      item.productType === "ebook"
        ? item.product.ebookDiscount
        : item.product.hardcopyDiscount;
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <FaShoppingCart className="text-6xl text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <Link
          to="/all-books"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart ({items.length} items)
          </h1>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-red-600 hover:text-red-700 font-medium flex items-center"
          >
            <FaTrash className="mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {items.map((item) => {
                const { original, discounted } = calculateItemPrice(item);
                return (
                  <div
                    key={`${item.product._id}-${item.productType || "default"}`}
                    className="p-6 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex space-x-6">
                      <img
                        src={item.product.coverImage}
                        alt={item.product.title}
                        className="w-32 h-40 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {item.product.title}
                            </h3>
                            <p className="text-gray-600 capitalize">
                              {item.productType}
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
                                  {item.productType === "ebook"
                                    ? item.product.ebookDiscount
                                    : item.product.hardcopyDiscount}
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
                                handleUpdateQuantity(
                                  item.product._id,
                                  Math.max(1, item.quantity - 1)
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
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <FaPlus className="text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              dispatch(removeFromCart(item.product._id))
                            }
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
