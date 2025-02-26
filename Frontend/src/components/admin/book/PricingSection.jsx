import React from "react";
import { TextInput, Label } from "flowbite-react";

const PricingSection = ({ bookData, handleInputChange }) => {
  return (
    <div className="col-span-1 bg-slate-700/50 p-4 rounded-lg">
      <h3 className="text-white font-medium mb-4">Pricing & Stock</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-gray-300">Price & Stock</Label>
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              name="price"
              placeholder="Price"
              type="number"
              value={bookData.price || ""}
              onChange={handleInputChange}
              className="w-full"
            />
            <TextInput
              name="stock"
              placeholder="Stock"
              type="number"
              value={bookData.stock || ""}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <Label className="text-gray-300">Discounts</Label>
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              name="hardcopyDiscount"
              placeholder="Hardcopy Discount %"
              type="number"
              value={bookData.hardcopyDiscount || ""}
              onChange={handleInputChange}
              className="w-full"
            />
            {bookData.isEbookAvailable && (
              <TextInput
                name="ebookDiscount"
                placeholder="eBook Discount %"
                type="number"
                value={bookData.ebookDiscount || ""}
                onChange={handleInputChange}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
