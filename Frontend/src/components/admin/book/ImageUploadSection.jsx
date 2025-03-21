import { Label } from "flowbite-react";
import { HiUpload, HiX } from "react-icons/hi";
import { motion } from "framer-motion";

const ImageUploadSection = ({ bookData, setBookData, handleFileChange }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md space-y-6">
      <h3 className="text-blue-900 font-semibold mb-4">Images</h3>

      {/* Cover Image Upload */}
      <div className="space-y-3">
        <Label className="text-blue-800 font-medium">Cover Image</Label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="relative flex items-center justify-center h-32 w-full border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl transition-colors bg-white">
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {!bookData.coverImage ? (
                <div className="text-center">
                  <HiUpload className="mx-auto h-8 w-8 text-purple-400" />
                  <p className="mt-1 text-sm text-purple-600">
                    Click to upload cover image
                  </p>
                </div>
              ) : (
                <img
                  src={
                    typeof bookData.coverImage === "string"
                      ? bookData.coverImage
                      : bookData.coverImage.preview
                  }
                  alt="Cover Preview"
                  className="h-full w-auto object-contain rounded-lg"
                />
              )}
            </div>
          </div>
          {bookData.coverImage && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setBookData((prev) => ({ ...prev, coverImage: null }))
              }
              className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
            >
              <HiX className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Additional Images Upload */}
      <div className="space-y-3">
        <Label className="text-blue-800 font-medium">
          Additional Images (Max 4)
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative">
              <div className="aspect-square relative flex items-center justify-center border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl transition-colors bg-white">
                {bookData.bookImages?.[index] ? (
                  <>
                    <img
                      src={
                        typeof bookData.bookImages[index] === "string"
                          ? bookData.bookImages[index]
                          : bookData.bookImages[index].preview
                      }
                      alt={`Extra ${index + 1}`}
                      className="h-full w-full object-cover rounded-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                      onClick={() => {
                        setBookData((prev) => ({
                          ...prev,
                          bookImages: prev.bookImages.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      <HiX className="h-3 w-3" />
                    </motion.button>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex items-center justify-center">
                    <input
                      type="file"
                      name="bookImages"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="text-center">
                      <HiUpload className="mx-auto h-6 w-6 text-purple-400" />
                      <p className="text-xs text-purple-600">Add</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
