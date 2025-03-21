import { Label } from "flowbite-react";
import { HiUpload, HiDocumentText } from "react-icons/hi";

const EbookSection = ({ bookData, handleInputChange, handleFileChange }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md">
      <h3 className="text-blue-900 font-semibold mb-4">eBook Information</h3>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isEbookAvailable"
            id="isEbookAvailable"
            checked={bookData.isEbookAvailable || false}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <Label htmlFor="isEbookAvailable" className="ml-2 text-blue-900">
            eBook Available
          </Label>
        </div>

        {bookData.isEbookAvailable && (
          <div className="flex-1 w-full">
            <div className="relative flex items-center justify-center h-20 w-full border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl transition-colors bg-white">
              <input
                type="file"
                name="eBook"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {bookData.eBook ? (
                <div className="flex items-center text-blue-800">
                  <HiDocumentText className="h-6 w-6 mr-2" />
                  <span className="text-sm">
                    {typeof bookData.eBook === "string"
                      ? bookData.eBook.split("/").pop()
                      : bookData.eBook.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <HiUpload className="mx-auto h-6 w-6 text-purple-400" />
                  <p className="mt-1 text-sm text-purple-600">
                    Upload PDF eBook
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookSection;
