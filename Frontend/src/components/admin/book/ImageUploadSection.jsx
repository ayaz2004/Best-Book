import React from "react";
import { Button, Label } from "flowbite-react";
import { HiUpload, HiX } from "react-icons/hi";

const ImageUploadSection = ({ bookData, setBookData, handleFileChange }) => {
  return (
    <div className="bg-slate-700/50 p-4 rounded-lg space-y-6">
      <h3 className="text-white font-medium mb-4">Images</h3>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label className="text-gray-300">Cover Image</Label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="relative flex items-center justify-center h-32 w-full border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-500 transition-colors">
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {!bookData.coverImage ? (
                <div className="text-center">
                  <HiUpload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-400">
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
                  className="h-full w-full object-contain rounded-lg"
                />
              )}
            </div>
          </div>
          {bookData.coverImage && (
            <Button
              size="sm"
              color="failure"
              onClick={() =>
                setBookData((prev) => ({ ...prev, coverImage: null }))
              }
            >
              <HiX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Additional Images Upload */}
      <div className="space-y-2">
        <Label className="text-gray-300">Additional Images (Max 4)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative">
              <div className="aspect-square relative flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-500 transition-colors">
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
                    <Button
                      size="sm"
                      color="failure"
                      className="absolute -top-2 -right-2"
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
                    </Button>
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
                    <HiUpload className="h-6 w-6 text-gray-400" />
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
