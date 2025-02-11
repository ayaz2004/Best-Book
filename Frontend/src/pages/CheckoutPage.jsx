import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Label,
  TextInput,
  Radio,
  Button,
  Alert,
  Toast,
} from "flowbite-react";
import {
  FaCreditCard,
  FaTruck,
  FaBox,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";
import { clearCart } from "../redux/cart/cartSlice";
import { HiCheck, HiX } from "react-icons/hi";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { items, discount } = useSelector((state) => state.cart);

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
      price: 99,
      time: "1-2 business days",
      icon: FaBox,
    },
  ];

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 49,
    discount: 0,
    couponDiscount: 0,
    total: 0,
  });

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

  const calculateSubtotal = (items) => {
    return (
      items?.reduce((total, item) => {
        const { original } = calculateItemPrice(item);
        return total + original * item.quantity;
      }, 0) || 0
    );
  };

  const calculateTotalSavings = (items) => {
    return (
      items?.reduce((total, item) => {
        const { savings } = calculateItemPrice(item);
        return total + savings * item.quantity;
      }, 0) || 0
    );
  };

  useEffect(() => {
    const subtotal = calculateSubtotal(items);
    const productDiscount = calculateTotalSavings(items);
    const priceAfterProductDiscount = subtotal - productDiscount;

    const deliveryCharge =
      deliveryOptions.find((option) => option.id === selectedDelivery)?.price ||
      49;

    // Calculate coupon discount after product discounts
    const couponDisc = appliedCoupon
      ? (priceAfterProductDiscount * appliedCoupon.discountPercentage) / 100
      : 0;

    setOrderSummary({
      subtotal,
      shipping: deliveryCharge,
      discount: productDiscount,
      couponDiscount: couponDisc,
      total: priceAfterProductDiscount - couponDisc + deliveryCharge,
    });
  }, [items, selectedDelivery, appliedCoupon]);

  const handleApplyCoupon = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order/applycoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.accessToken}`,
        },
        body: JSON.stringify({ couponCode }),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setShowToast(true);
        setToastMessage(data.message);
        setAppliedCoupon(null);
        setCouponError(data.message);
        return;
      } else {
        // Calculate coupon discount
        const priceAfterProductDiscount =
          orderSummary.subtotal - orderSummary.discount;
        const discountAmount = (priceAfterProductDiscount * data.data) / 100;

        setAppliedCoupon({
          code: data.couponCode,
          discountPercentage: data.data,
          discountAmount: discountAmount,
        });

        setCouponCode("");
        setShowToast(true);
        setToastMessage(`Coupon applied! ${data.data}% off`);
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage("Error applying coupon");
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const handlePlaceOrder = async () => {
    setLoading(true);

    const orderData = {
      userId: currentUser._id,
      items: items,
      totalAmount: orderSummary.total,
      shippingAddress: formData,
      paymentProvider: paymentMethod === "cod" ? "COD" : "ONLINE",
      isPaymentDone: paymentMethod !== "cod",
    };

    try {
      const res = await fetch("/api/order/placeorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.accessToken}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentUser.accessToken}`,
        },
      });

      dispatch(clearCart());
      console.log("Order placed successfully:");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setCouponError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast duration={3000} onClose={() => setShowToast(false)}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              {appliedCoupon ? (
                <HiCheck className="h-5 w-5 text-green-500" />
              ) : (
                <HiX className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Form */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FaMapMarkerAlt className="h-5 w-5" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" value="First Name" />
                    <TextInput
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" value="Last Name" />
                    <TextInput
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" value="Phone" />
                    <TextInput
                      id="phone"
                      type="text"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address1" value="Address Line 1" />
                    <TextInput
                      id="address1"
                      type="text"
                      placeholder="Address Line 1"
                      value={formData.address1}
                      onChange={(e) =>
                        setFormData({ ...formData, address1: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address2" value="Address Line 2" />
                    <TextInput
                      id="address2"
                      type="text"
                      placeholder="Address Line 2"
                      value={formData.address2}
                      onChange={(e) =>
                        setFormData({ ...formData, address2: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" value="City" />
                    <TextInput
                      id="city"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" value="State" />
                    <TextInput
                      id="state"
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pin" value="Pincode" />
                    <TextInput
                      id="pin"
                      type="text"
                      placeholder="Pin Code"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" value="Country" />
                    <TextInput
                      id="country"
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </form>
            </Card>

            {/* Delivery Options */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FaTruck className="h-5 w-5" />
                <h2 className="text-xl font-bold">Delivery Method</h2>
              </div>
              <div className="space-y-4">
                {deliveryOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedDelivery === option.id
                        ? "border-purple-600 bg-purple-50"
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
              </div>
            </Card>

            {/* Payment Method */}
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
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
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
                        <h3 className="text-sm font-medium">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ₹{discounted.toFixed(2)}
                          </span>
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
                            Save ₹
                            {((original - discounted) * item.quantity).toFixed(
                              2
                            )}
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
                  <span className="ml-auto">
                    ₹{orderSummary.subtotal.toFixed(2)}
                  </span>
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
                    {loading
                      ? "Applying..."
                      : appliedCoupon
                      ? "Applied"
                      : "Apply"}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
