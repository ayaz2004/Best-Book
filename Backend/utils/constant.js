export const CouponTypeEnum = {
  FLAT: "FLAT",
  // PERCENTAGE: "PERCENTAGE",
};

export const AvailableCouponTypes = Object.values(CouponTypeEnum);

export const OrderStatusEnum = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
};

export const AvailableOrderStatuses = Object.values(OrderStatusEnum);

export const PaymentProviderEnum = {
  COD: "COD",
  PHONEPAY: "PHONEPAY",
  PAYPAL: "PAYPAL",
};

export const AvailablePaymentProviders = Object.values(PaymentProviderEnum);
