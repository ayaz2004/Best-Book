import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart/getcart/${currentUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentUser.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
         
          setItems(data.cartData.items);
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

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch("/api/cart/update-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setItems(data.cartData.items);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <FaShoppingCart className="text-6xl text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <Link
          to="/all-books"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        // Refresh cart after removal
        const updatedItems = items.filter(
          (item) => item.product._id !== productId
        );
        setItems(updatedItems);
      }
    } catch (error) {
      setError("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
      });

      if (response.ok) {
        setItems([]); // Clear items locally
      }
    } catch (error) {
      setError("Failed to clear cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">
            Shopping Cart ({items.length} items)
          </h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 flex items-center"
          >
            <FaTrash className="mr-2" /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => {
              const { original, discounted } = calculateItemPrice(item);
              return (
                <div
                  key={item.product._id}
                  className="bg-white p-6 mb-4 rounded-lg shadow"
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
                          <p className="text-gray-600">{item.productType}</p>
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
                                Save {item.product.ebookDiscount}%
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
                                item.quantity - 1
                              )
                            }
                            className="p-2"
                          >
                            <FaMinus />
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
                            className="p-2"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
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

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg">
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
