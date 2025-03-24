import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, clearCart, removeFromCart } from "../redux/cart/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const {
    items,
    loading,
    error: cartError,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, currentUser, navigate]);

  const handleUpdateQuantity = async (e, productId, productType, quantity) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      const res = await fetch("/api/cart/update-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ productId, productType, quantity }),
      });

      if (res.ok) {
        dispatch(fetchCart());
      }
    } catch (error) {
      setError("Failed to update quantity");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-purple-800 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Error Loading Cart
          </h2>
          <p className="text-gray-600 text-center mb-6">{cartError}</p>
          <button
            onClick={() => dispatch(fetchCart())}
            className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="min-h-screen bg-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Add checkout flow here for consistency */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div
                className="w-full absolute h-1 bg-gray-200"
                style={{ top: "50%" }}
              ></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-purple-800 text-white rounded-full flex items-center justify-center mb-1">
                  1
                </div>
                <span className="text-sm font-medium text-blue-900">Cart</span>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                  2
                </div>
                <span className="text-sm text-gray-500">Checkout</span>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                  3
                </div>
                <span className="text-sm text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <FaShoppingCart className="text-6xl text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-600">
              Your cart is empty
            </h2>
            <Link
              to="/all-books"
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRemoveItem = async (e, productId, productType) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ productId, productType }),
      });

      if (res.ok) {
        dispatch(fetchCart(productId));
      }
    } catch (error) {
      setError("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
      });

      if (res.ok) {
        dispatch(clearCart());
      }
    } catch (error) {
      setError("Failed to clear cart");
    }
  };

  const navigateToBookDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-900">
            Shopping Cart ({items.length} items)
          </h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 flex items-center hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
          >
            <FaTrash className="mr-2" /> Clear Cart
          </button>
        </div>

        {/* Add checkout flow indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div
              className="w-full absolute h-1 bg-gray-200"
              style={{ top: "50%" }}
            ></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-purple-800 text-white rounded-full flex items-center justify-center mb-1">
                1
              </div>
              <span className="text-sm font-medium text-blue-900">Cart</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                2
              </div>
              <span className="text-sm text-gray-500">Checkout</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                3
              </div>
              <span className="text-sm text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => {
              const { original, discounted } = calculateItemPrice(item);
              return (
                <div
                  key={`${item.product._id}-${item.productType}`}
                  className="bg-white p-6 mb-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex space-x-6">
                    <img
                      src={item.product.coverImage}
                      alt={item.product.title}
                      className="w-32 h-40 object-cover rounded-lg cursor-pointer"
                      onClick={() => navigateToBookDetails(item.product._id)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3
                            className="text-lg font-semibold text-blue-900 hover:text-purple-800 cursor-pointer"
                            onClick={() =>
                              navigateToBookDetails(item.product._id)
                            }
                          >
                            {item.product.title}
                          </h3>
                          <p className="text-gray-600 capitalize">
                            {item.productType === "ebook"
                              ? "eBook"
                              : "Hardcopy"}
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
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={(e) =>
                              handleUpdateQuantity(
                                e,
                                item.product._id,
                                item.productType,
                                item.quantity - 1
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus
                              className={
                                item.quantity <= 1
                                  ? "text-gray-400"
                                  : "text-gray-700"
                              }
                            />
                          </button>
                          <span className="px-4 py-2 border-x bg-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) =>
                              handleUpdateQuantity(
                                e,
                                item.product._id,
                                item.productType,
                                item.quantity + 1
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FaPlus className="text-gray-700" />
                          </button>
                        </div>
                        <button
                          onClick={(e) =>
                            handleRemoveItem(
                              e,
                              item.product._id,
                              item.productType
                            )
                          }
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
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
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-blue-900">
                Order Summary
              </h2>
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
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 rounded-lg hover:shadow-lg transition-all"
              >
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
