import React from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

export default function ToastNotification({
  showToast,
  setShowToast,
  toastMessage,
  appliedCoupon,
}) {
  if (!showToast) return null;

  return (
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
  );
}
