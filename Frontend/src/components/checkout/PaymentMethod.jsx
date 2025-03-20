import { motion } from "framer-motion";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { HiCash } from "react-icons/hi";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  const paymentOptions = [
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: FaMoneyBillWave,
    },
    {
      id: "online",
      name: "Online Payment",
      description: "Pay securely with credit/debit card or UPI",
      icon: FaCreditCard,
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden"
      whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 px-6 py-4 flex items-center">
        <HiCash className="text-white mr-2 text-xl" />
        <h2 className="text-lg font-semibold text-white">Payment Method</h2>
      </div>

      <div className="p-6 space-y-3">
        {paymentOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === option.id
                ? "border-blue-600 bg-blue-50"
                : "border-purple-200 hover:border-purple-300"
            }`}
            onClick={() => setPaymentMethod(option.id)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`p-3 rounded-full ${
                    paymentMethod === option.id
                      ? "bg-gradient-to-r from-blue-800 to-purple-700 text-white"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <option.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-blue-900">{option.name}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === option.id
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === option.id && (
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PaymentMethod;
