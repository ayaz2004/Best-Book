import { Table, Button } from "flowbite-react";
import { HiPencilAlt, HiEye, HiTrash } from "react-icons/hi";

const BookTable = ({ books, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 overflow-x-auto">
      <Table className="bg-transparent min-w-full">
        <Table.Head>
          <Table.HeadCell className="text-purple-700 whitespace-nowrap">
            Book Details
          </Table.HeadCell>
          <Table.HeadCell className="text-purple-700 whitespace-nowrap">
            Price & Stock
          </Table.HeadCell>
          <Table.HeadCell className="text-purple-700 whitespace-nowrap">
            Target Exam
          </Table.HeadCell>
          <Table.HeadCell className="text-purple-700 whitespace-nowrap">
            Actions
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {books.map((book) => (
            <Table.Row
              key={book._id}
              className="border-gray-700 bg-slate-700/50"
            >
              <Table.Cell className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg"
                />
                <div className="text-center sm:text-left">
                  <p className="text-white font-medium">{book.title}</p>
                  <p className="text-gray-400 text-sm">{book.author}</p>
                  <p className="text-gray-500 text-xs">
                    Added: {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-white">Original Price: ₹{book.price}</p>
                  {book.hardcopyDiscount > 0 && (
                    <p className="text-green-400 text-sm">
                      hardcopy: -{book.hardcopyDiscount}% off
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
                    <p className="text-blue-400 text-sm">
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
                  <p className="text-gray-400 text-sm">Stock: {book.stock}</p>
                </div>
              </Table.Cell>
              <Table.Cell className="text-white text-center">
                {book.targetExam}
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-purple-600"
                    onClick={() => onEdit(book)}
                  >
                    <HiPencilAlt className="mr-1" />
                    Edit
                  </Button>
                  {book.isEbookAvailable && book.eBook && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-blue-600"
                      onClick={() => window.open(book.eBook, "_blank")}
                    >
                      <HiEye className="mr-1" />
                      View
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-red-500 to-red-600"
                    onClick={() => onDelete(book._id)}
                  >
                    <HiTrash className="mr-1" />
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default BookTable;
