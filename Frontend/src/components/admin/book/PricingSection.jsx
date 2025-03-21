import { Label } from "flowbite-react";

const PricingSection = ({ bookData, handleInputChange }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md">
      <h3 className="text-blue-900 font-semibold mb-4">Pricing & Stock</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-blue-800 font-medium mb-1.5">
            Price & Stock
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="price"
                placeholder="Price"
                type="number"
                value={bookData.price || ""}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <div>
              <input
                name="stock"
                placeholder="Stock"
                type="number"
                value={bookData.stock || ""}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Discounts</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="hardcopyDiscount"
                placeholder="Hardcopy Discount %"
                type="number"
                value={bookData.hardcopyDiscount || ""}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>

            {bookData.isEbookAvailable && (
              <div>
                <input
                  name="ebookDiscount"
                  placeholder="eBook Discount %"
                  type="number"
                  value={bookData.ebookDiscount || ""}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
