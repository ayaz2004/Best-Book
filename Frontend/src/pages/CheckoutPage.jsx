import React, { useState } from "react";
import {
  Card,
  Label,
  TextInput,
  Radio,
  Button,
  Alert,
  Tabs,
  Spinner,
} from "flowbite-react";
import {
  FaCreditCard,
  FaTruck,
  FaBox,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";
import { FaQrcode } from "react-icons/fa6";

const CheckoutPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 2499,
    shipping: 49,
    discount: 0,
    tax: 225,
    total: 2773,
  });

  const handleCheckout = () => {
    console.log("Processing checkout...");
  };

  const handleApplyCoupon = () => {
    setLoading(true);
    setTimeout(() => {
      if (couponCode === "DISCOUNT10") {
        const discount = orderSummary.subtotal * 0.1;
        setOrderSummary((prev) => ({
          ...prev,
          discount,
          total: prev.subtotal + prev.shipping + prev.tax - discount,
        }));
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code");
      }
      setLoading(false);
    }, 1000);
  };

  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 49,
      time: "3-5 business days",
      icon: FaTruck,
    },
    {
      id: "express",
      name: "Express Delivery",
      price: 149,
      time: "1-2 business days",
      icon: FaBox,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FaMapMarkerAlt className="h-5 w-5" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              {savedAddresses.length > 0 && !showNewAddress && (
                <div className="space-y-4 mb-6">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedAddress?.id === address.id
                          ? "border-blue-600 bg-blue-50"
                          : ""
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{address.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <FaExclamationCircle className="text-blue-600 h-5 w-5" />
                        )}
                      </div>
                    </div>
                  ))}
                  <Button color="blue" onClick={() => setShowNewAddress(true)}>
                    + Add New Address
                  </Button>
                </div>
              )}

              {(showNewAddress || savedAddresses.length === 0) && (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <TextInput id="firstName" type="text" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <TextInput id="lastName" type="text" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <TextInput id="phone" type="tel" />
                  </div>
                  <div>
                    <Label htmlFor="address1">Address Line 1</Label>
                    <TextInput id="address1" type="text" />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <TextInput id="address2" type="text" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <TextInput id="city" type="text" />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <TextInput id="state" type="text" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <TextInput id="zip" type="text" />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <TextInput id="country" type="text" />
                    </div>
                  </div>
                </form>
              )}
            </Card>

            {/* Delivery Options */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FaTruck className="h-5 w-5" />
                <h2 className="text-xl font-bold">Delivery Method</h2>
              </div>
              <fieldset className="space-y-4">
                {deliveryOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedDelivery === option.id
                        ? "border-blue-600 bg-blue-50"
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
              </fieldset>
            </Card>

            {/* Payment Method */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="h-5 w-5" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              <Tabs>
                <Tabs.Item active title="Credit Card" icon={FaCreditCard}>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <TextInput id="cardNumber" type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">MM/YY</Label>
                        <TextInput id="expiry" type="text" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <TextInput id="cvv" type="text" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <TextInput id="nameOnCard" type="text" />
                    </div>
                  </form>
                </Tabs.Item>
                <Tabs.Item title="UPI" icon={FaQrcode}>
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <TextInput
                      id="upiId"
                      type="text"
                      placeholder="Enter UPI ID"
                    />
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Cash on Delivery" icon={FaShoppingCart}>
                  <Alert color="info">
                    Pay in cash when your order is delivered. Additional fee of
                    ₹49 applies.
                  </Alert>
                </Tabs.Item>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <FaShoppingCart className="h-5 w-5" />
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{orderSummary.shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₹{orderSummary.tax}</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{orderSummary.discount}</span>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{orderSummary.total}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="pt-4">
                  <div className="flex gap-2">
                    <TextInput
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      icon={FaTags}
                    />
                    <Button
                      color="blue"
                      onClick={handleApplyCoupon}
                      disabled={loading || !couponCode}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Applying
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-2">{couponError}</p>
                  )}
                </div>

                <Button
                  color="blue"
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
