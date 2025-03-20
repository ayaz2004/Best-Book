import { FaShoppingCart, FaTag, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export default function OrderSummary({
  items,
  orderSummary,
  appliedCoupon,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  couponError,
  loading,
  handlePlaceOrder,
  calculateItemPrice,
  setAppliedCoupon,
}) {
  // Function to handle coupon removal
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
  };

  return (
    <div className="sticky top-4">
      <motion.div
        className="bg-white rounded-2xl shadow-md overflow-hidden"
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="bg-gradient-to-r from-blue-900 to-purple-800 px-6 py-4 flex items-center">
          <FaShoppingCart className="text-white mr-2 text-xl" />
          <h2 className="text-lg font-semibold text-white">Order Summary</h2>
        </div>

        <div className="p-6">
          {/* Cart Items (no changes) */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6 custom-scrollbar">
            {items?.map((item) => {
              const { original, discounted } = calculateItemPrice(item);
              return (
                <div
                  key={item._id || item.product._id}
                  className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={item.product.coverImage}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900 line-clamp-2">
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {item.productType === "ebook" ? "eBook" : "Hardcopy"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="font-medium text-sm text-blue-900">
                            ₹{discounted.toFixed(2)}
                          </span>
                          {discounted < original && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{original.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {discounted < original && (
                          <p className="text-xs text-green-600 text-right">
                            Save{" "}
                            {item.productType === "ebook"
                              ? item.product.ebookDiscount
                              : item.product.hardcopyDiscount}
                            %
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Coupon Section */}
          <div className="pt-4 mt-2 border-t border-gray-200">
            <div className="flex items-center bg-blue-50 rounded-lg p-3 mb-3">
              <FaTag className="text-blue-600 mr-2" />
              <span className="text-sm text-blue-800 font-medium">
                Apply coupon for additional discount
              </span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-500 text-white p-1 rounded-md mr-2">
                    <FaTag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-700">
                      {appliedCoupon.discountPercentage}% off (₹
                      {orderSummary.couponDiscount.toFixed(2)})
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 flex items-center justify-center"
                  aria-label="Remove coupon"
                >
                  <FaTimes className="h-4 w-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex space-x-0">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 pl-4 pr-4 py-2.5 text-sm border-2 border-r-0 border-purple-200 rounded-l-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode.trim()}
                  className="bg-gradient-to-r from-blue-700 to-purple-700 text-white px-4 py-2.5 rounded-r-xl text-sm font-medium disabled:opacity-50 min-w-[70px]"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-auto"></div>
                  ) : (
                    "Apply"
                  )}
                </motion.button>
              </div>
            )}

            {couponError && (
              <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded-lg">
                {couponError}
              </div>
            )}
          </div>

          {/* Price Breakdown - Improved Coupon Display */}
          <div className="space-y-2 pt-4 mt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                ₹{orderSummary.subtotal.toFixed(2)}
              </span>
            </div>

            {orderSummary.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Product Discount</span>
                <span>-₹{orderSummary.discount.toFixed(2)}</span>
              </div>
            )}

            {orderSummary.couponDiscount > 0 && appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <div className="flex items-center gap-1">
                  <span>Coupon Discount</span>
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    {appliedCoupon.code} ({appliedCoupon.discountPercentage}%
                    OFF)
                  </span>
                </div>
                <span>-₹{orderSummary.couponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="text-gray-900">₹{orderSummary.shipping}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-semibold text-blue-900">Total Amount</span>
              <div className="flex flex-col items-end">
                {appliedCoupon && (
                  <span className="text-xs text-gray-500 line-through mb-1">
                    ₹
                    {(
                      orderSummary.subtotal +
                      orderSummary.shipping -
                      orderSummary.discount
                    ).toFixed(2)}
                  </span>
                )}
                <span className="font-semibold text-purple-700">
                  ₹{orderSummary.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handlePlaceOrder}
          className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Processing...
            </>
          ) : (
            `Place Order ${
              orderSummary.total ? `- ₹${orderSummary.total.toFixed(2)}` : ""
            }`
          )}
        </motion.button>
      </div>
    </div>
  );
}
