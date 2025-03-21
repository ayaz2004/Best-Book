import { Table } from "flowbite-react";
import { HiPencilAlt, HiEye, HiTrash } from "react-icons/hi";
import { motion } from "framer-motion";

const BookTable = ({ books, onEdit, onDelete }) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No books found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <Table.Head className="bg-gradient-to-r from-blue-900 to-purple-800 text-white">
          <Table.HeadCell className="py-4">Book Details</Table.HeadCell>
          <Table.HeadCell>Price & Stock</Table.HeadCell>
          <Table.HeadCell>Target Exam</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {books.map((book, index) => (
            <motion.tr
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white hover:bg-purple-50 transition-colors"
            >
              <Table.Cell className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg shadow"
                />
                <div className="text-center sm:text-left">
                  <p className="text-blue-900 font-medium">{book.title}</p>
                  <p className="text-purple-600 text-sm">{book.author}</p>
                  <p className="text-gray-500 text-xs">
                    Added: {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-blue-900">Original Price: ₹{book.price}</p>
                  {book.hardcopyDiscount > 0 && (
                    <p className="text-green-600 text-sm">
                      Hardcopy: -{book.hardcopyDiscount}% off
                      <span className="ml-2">
                        ₹
                        {(
                          book.price -
                          (book.price * book.hardcopyDiscount) / 100
                        ).toFixed(2)}
                      </span>
                    </p>
                  )}
                  {book.isEbookAvailable && book.ebookDiscount > 0 && (
                    <p className="text-purple-600 text-sm">
                      eBook: -{book.ebookDiscount}% off
                      <span className="ml-2">
                        ₹
                        {(
                          book.price -
                          (book.price * book.ebookDiscount) / 100
                        ).toFixed(2)}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">Stock: {book.stock}</p>
                </div>
              </Table.Cell>
              <Table.Cell className="text-center text-purple-700">
                {book.targetExam}
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(book)}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm flex items-center justify-center"
                  >
                    <HiPencilAlt className="mr-1" />
                    Edit
                  </motion.button>

                  {book.isEbookAvailable && book.eBook && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(book.eBook, "_blank")}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm flex items-center justify-center"
                    >
                      <HiEye className="mr-1" />
                      View
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(book._id)}
                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm flex items-center justify-center"
                  >
                    <HiTrash className="mr-1" />
                    Delete
                  </motion.button>
                </div>
              </Table.Cell>
            </motion.tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default BookTable;
