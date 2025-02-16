import React from "react";
import { Card } from "flowbite-react";
import { Book, Package } from "lucide-react";

const getRandomCoverImage = () => {
  const images = [
    "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const OrderCard = ({ order }) => {
  return (
    <Card className="max-w-sm transform transition-all duration-300 hover:scale-105">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={order.coverImage || getRandomCoverImage()}
          alt={order.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-semibold text-lg truncate">
            Order #{order._id.slice(-8)}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {order.items[0].productType === 'ebook' ? (
              <Book className="h-5 w-5 text-purple-500" />
            ) : (
              <Package className="h-5 w-5 text-purple-500" />
            )}
            <span className="text-sm font-medium text-gray-600">
              {order.items.length} items
            </span>
          </div>
          <span className="text-sm font-semibold text-purple-600">
            ₹{order.totalAmount}
          </span>
        </div>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product.title}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ₹{item.product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Order Status</span>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full
              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}">
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export  {OrderCard};