import React from "react";
import { TextInput, Label } from "flowbite-react";

const BookForm = ({ bookData, handleInputChange }) => {
  return (
    <div className="lg:col-span-2 bg-slate-700/50 p-4 rounded-lg">
      <h3 className="text-white font-medium mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          name="title"
          placeholder="Book Title"
          value={bookData.title || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="author"
          placeholder="Author"
          value={bookData.author || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="ISBN"
          placeholder="ISBN"
          value={bookData.ISBN || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="publisher"
          placeholder="Publisher"
          value={bookData.publisher || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="language"
          placeholder="Language"
          value={bookData.language || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="pages"
          placeholder="Number of Pages"
          type="number"
          value={bookData.pages || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="category"
          placeholder="Category"
          value={bookData.category || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <TextInput
          name="targetExam"
          placeholder="Target Exam"
          value={bookData.targetExam || ""}
          onChange={handleInputChange}
          className="bg-slate-600 text-white w-full"
          required
        />
        <div className="sm:col-span-2">
          <TextInput
            name="publicationDate"
            type="date"
            placeholder="Publication Date"
            value={
              bookData.publicationDate
                ? new Date(bookData.publicationDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            className="bg-slate-600 text-white w-full"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-gray-300 mb-2">Description</Label>
          <textarea
            name="description"
            placeholder="Book Description"
            value={bookData.description || ""}
            onChange={handleInputChange}
            className="w-full bg-slate-600 text-white rounded-lg p-2.5"
            rows="4"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BookForm;
