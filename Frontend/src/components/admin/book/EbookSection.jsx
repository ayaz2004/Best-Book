import { Label } from "flowbite-react";

const EbookSection = ({ bookData, handleInputChange, handleFileChange }) => {
  return (
    <div className="col-span-2 bg-slate-700/50 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Label className="text-gray-300 flex items-center">
          <input
            type="checkbox"
            name="isEbookAvailable"
            checked={bookData.isEbookAvailable || false}
            onChange={handleInputChange}
            className="mr-2"
          />
          eBook Available
        </Label>
        {bookData.isEbookAvailable && (
          <div className="flex-1">
            <input
              type="file"
              name="eBook"
              onChange={handleFileChange}
              accept="application/pdf"
              className="text-gray-300 w-full sm:w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookSection;
