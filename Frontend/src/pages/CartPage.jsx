import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../redux/cart/cartSlice";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, loading, error } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-500 font-medium">{error}</p>
          <Link
            to="/"
            className="text-purple-600 hover:underline mt-2 inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <FaShoppingCart className="text-6xl text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <p className="text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>
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
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.type}`}
                  className="p-6 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg shadow"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.type}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center border rounded-lg">
                          <button className="p-2 hover:bg-gray-100">
                            <FaMinus className="text-gray-600" />
                          </button>
                          <span className="px-4 py-2 border-x">
                            {item.quantity}
                          </span>
                          <button className="p-2 hover:bg-gray-100">
                            <FaPlus className="text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.productId))
                          }
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ₹{item.price * item.quantity}
                      </p>
                      {item.discount > 0 && (
                        <p className="text-sm text-green-600">
                          Save {item.discount}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
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
