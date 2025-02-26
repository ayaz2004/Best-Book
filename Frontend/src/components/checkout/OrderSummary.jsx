import React from "react";
import { Card, Button, TextInput, Alert } from "flowbite-react";
import { FaShoppingCart, FaTags } from "react-icons/fa";

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
}) {
  return (
    <Card className="sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <FaShoppingCart className="h-5 w-5" />
        <h2 className="text-xl font-bold">Order Summary</h2>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items?.map((item) => {
          const { original, discounted } = calculateItemPrice(item);
          return (
            <div key={item._id} className="flex items-center space-x-4">
              <img
                src={item.product.coverImage}
                alt={item.product.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.product.title}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">₹{discounted.toFixed(2)}</span>
                  {discounted < original && (
                    <React.Fragment>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{original.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600">
                        Save {item.product.ebookDiscount}%
                      </span>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ₹{(discounted * item.quantity).toFixed(2)}
                </p>
                {discounted < original && (
                  <p className="text-sm text-green-600">
                    Save ₹{((original - discounted) * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 border-t pt-4">
        <div key="subtotal" className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="ml-auto">₹{orderSummary.subtotal.toFixed(2)}</span>
        </div>

        {orderSummary.discount > 0 && (
          <div
            key="savings"
            className="flex justify-between text-sm text-green-600"
          >
            <span>Product Discount</span>
            <span className="ml-auto">
              -₹{orderSummary.discount.toFixed(2)}
            </span>
          </div>
        )}

        {orderSummary.couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <div className="flex items-center gap-1">
              <span>Coupon Coupon ({appliedCoupon.code})</span>
              <span className="text-xs bg-green-100 px-1.5 py-0.5 rounded">
                {appliedCoupon.discountPercentage}% OFF
              </span>
            </div>
            <span className="ml-auto">
              -₹{orderSummary.couponDiscount.toFixed(2)}
            </span>
          </div>
        )}
        <div key="delivery" className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Charge</span>
          <span>₹{orderSummary.shipping}</span>
        </div>
        <div
          key="total"
          className="flex justify-between font-bold border-t pt-4"
        >
          <span>Total Amount</span>
          <div className="flex flex-col items-end">
            {appliedCoupon && (
              <span className="text-sm text-gray-500 line-through mb-1">
                ₹
                {(
                  orderSummary.subtotal +
                  orderSummary.shipping -
                  orderSummary.discount
                ).toFixed(2)}
              </span>
            )}
            <span className="text-purple-600">
              ₹{orderSummary.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mt-6">
        <div className="flex gap-2">
          <TextInput
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            icon={FaTags}
            disabled={appliedCoupon !== null}
          />
          <Button
            color={appliedCoupon ? "success" : "purple"}
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode || appliedCoupon !== null}
          >
            {loading ? "Applying..." : appliedCoupon ? "Applied" : "Apply"}
          </Button>
        </div>
        {couponError && (
          <Alert color="failure" className="mt-2">
            {couponError}
          </Alert>
        )}
      </div>

      <Button
        color="purple"
        className="w-full mt-6"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        Place Order
      </Button>
    </Card>
  );
}
