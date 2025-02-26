import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaBox } from "react-icons/fa";
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
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastNotification
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        appliedCoupon={appliedCoupon}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
          </div>

          <div className="lg:col-span-1">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
