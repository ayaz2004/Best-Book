import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaTruck, FaBox, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { clearCart } from "../redux/cart/cartSlice";

import ShippingAddressForm from "../components/checkout/ShippingAddressForm";
import DeliveryOptions from "../components/checkout/DeliveryOptions";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import ToastNotification from "../components/checkout/ToastNotification";

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

  const { items } = useSelector((state) => state.cart);

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

    if (paymentMethod === "cod") {
      const orderData = {
        userId: currentUser._id,
        items: items,
        totalAmount: orderSummary.total,
        shippingAddress: formData,
        paymentProvider: "COD",
        isPaymentDone: false,
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
    } else {
      const paymentPayload = {
        name: currentUser.username,
        mobileNumber: formData.phone,
        totalAmount: orderSummary.total,
        userId: currentUser._id,
      };

      try {
        const res = await fetch("/api/order/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentUser.accessToken}`,
          },
          body: JSON.stringify(paymentPayload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        if (data.redirectUrl) {
          // Redirect to the payment gateway
          window.location.href = data.redirectUrl;
        } else {
          throw new Error("Payment initiation failed");
        }
      } catch (error) {
        console.error("Error initiating payment:", error);
        setCouponError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-purple-50 py-8 px-4"
    >
      <ToastNotification
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        appliedCoupon={appliedCoupon}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="flex items-center text-blue-900 hover:text-purple-700 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to cart
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-900">Checkout</h1>
            <div className="flex items-center text-purple-700">
              <FaShoppingCart className="mr-2" />
              <span>{items?.length || 0} items</span>
            </div>
          </div>
        </div>
        {/* Checkout flow progress */}
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-purple-800 text-white rounded-full flex items-center justify-center mb-1">
                2
              </div>
              <span className="text-sm font-medium text-blue-900">
                Checkout
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                3
              </div>
              <span className="text-sm text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ShippingAddressForm
              formData={formData}
              setFormData={setFormData}
            />
            <DeliveryOptions
              selectedDelivery={selectedDelivery}
              setSelectedDelivery={setSelectedDelivery}
              deliveryOptions={deliveryOptions}
            />
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </motion.div>

          <motion.dev
            className="lg:col-span-1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <OrderSummary
              items={items}
              orderSummary={orderSummary}
              appliedCoupon={appliedCoupon}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleApplyCoupon={handleApplyCoupon}
              couponError={couponError}
              loading={loading}
              handlePlaceOrder={handlePlaceOrder}
              calculateItemPrice={calculateItemPrice}
              setAppliedCoupon={setAppliedCoupon}
            />
          </motion.dev>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
