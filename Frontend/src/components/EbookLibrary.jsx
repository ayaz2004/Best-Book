import React, { useCallback, useEffect } from "react";
import { BookOpen, Download, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateSubscribedEbooks } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const EbookLibrary = () => {
  // Sample data - in real usage, this would come from props or an API
  const navigate = useNavigate();
  const { subscribedEbook,currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
useEffect(()=>{
  const purchasedEbooks = async () => {
    try {
      const response = await fetch("/api/book/purchasedebooks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        console.log(data.message);
      }
      dispatch(updateSubscribedEbooks(data.ebooks));
    } catch (error) {
      console.log("error fetching purchsed Ebooks", error.message);
    }
  };
  purchasedEbooks();
},[])

const MoveToDetailsPage = (bookId) => {
  navigate(`/book/${bookId}`);
}

console.log(subscribedEbook)
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            My Library
          </h1>

          <div className="flex flex-wrap gap-4">
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Fiction</option>
              <option>Business</option>
            </select>

            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <option>Recently Read</option>
              <option>Title A-Z</option>
              <option>Progress</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscribedEbook.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="p-5">
                <div className="flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-24 h-32 object-cover rounded-lg shadow"
                  />
                  <div className="flex-1">
                    <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                      {book.title}
                      
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {book.author}
                    </p>
                    <div className="mt-3">
                      {/* <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Reading Progress
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Last read: {new Date(book.lastRead).toLocaleDateString()}
                </p>

                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read
                  </button>

                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>

                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                  onClick={()=>{
                    MoveToDetailsPage(book._id)
                  }}>
                    <Info className="w-4 h-4 mr-2" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EbookLibrary;

