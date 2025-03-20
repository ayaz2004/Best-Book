import { Label } from "flowbite-react";

const BookForm = ({ bookData, handleInputChange }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md">
      <h3 className="text-blue-900 font-semibold mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Title</Label>
          <input
            name="title"
            placeholder="Book Title"
            value={bookData.title || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Author</Label>
          <input
            name="author"
            placeholder="Author"
            value={bookData.author || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">ISBN</Label>
          <input
            name="ISBN"
            placeholder="ISBN"
            value={bookData.ISBN || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Publisher</Label>
          <input
            name="publisher"
            placeholder="Publisher"
            value={bookData.publisher || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Language</Label>
          <input
            name="language"
            placeholder="Language"
            value={bookData.language || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Pages</Label>
          <input
            name="pages"
            placeholder="Number of Pages"
            type="number"
            value={bookData.pages || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">Category</Label>
          <input
            name="category"
            placeholder="Category"
            value={bookData.category || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div>
          <Label className="text-blue-800 font-medium mb-1.5">
            Target Exam
          </Label>
          <input
            name="targetExam"
            placeholder="Target Exam"
            value={bookData.targetExam || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="text-blue-800 font-medium mb-1.5">
            Publication Date
          </Label>
          <input
            name="publicationDate"
            type="date"
            placeholder="Publication Date"
            value={
              bookData.publicationDate
                ? new Date(bookData.publicationDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label className="text-blue-800 font-medium mb-1.5">
            Description
          </Label>
          <textarea
            name="description"
            placeholder="Book Description"
            value={bookData.description || ""}
            onChange={handleInputChange}
            className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            rows="4"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BookForm;
