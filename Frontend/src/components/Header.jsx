import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import {
  handleSessionExpired,
  selectIsSessionValid,
  signoutSuccess,
} from "../redux/user/userSlice";
import { authenticatedFetch } from "../utils/api";
import { clearCart } from "../redux/cart/cartSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSessionValid = useSelector(selectIsSessionValid);
  const { currentUser } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  const cartCount = currentUser ? items?.length || 0 : 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // New state for search functionality
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileSearchRef = useRef(null);

  const handleSignout = async () => {
    try {
      await authenticatedFetch(
        "/api/user/signout",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentUser?.token}`,
          },
        },
        dispatch
      );

      dispatch(signoutSuccess());
      dispatch(clearCart());
      navigate("/sign-in");
    } catch (error) {
      if (error.message !== "Session expired") {
        console.error("Signout failed:", error.message);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      const checkSession = () => {
        if (!isSessionValid) {
          dispatch(handleSessionExpired());
          dispatch(clearCart());
          navigate("/sign-in");
        }
      };

      const interval = setInterval(checkSession, 60000); // Check every minute
      checkSession(); // Initial check

      return () => clearInterval(interval);
    }
  }, [currentUser, isSessionValid, dispatch, navigate]);

  const handleCartClick = () => {
    if (currentUser && isSessionValid) {
      navigate("/cart");
    } else {
      navigate("/sign-in");
    }
  };
  
  // New function to handle search
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };
  
  // Click outside to close mobile search
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setMobileSearchOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileSearchRef]);

  return (
    <header className="bg-gray-50 py-4 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
        >
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Best Book
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="font-medium text-blue-800 hover:text-blue-900"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="font-medium text-blue-800 hover:text-blue-900"
          >
            About
          </Link>
          <Link
            to="/orders"
            className="font-medium text-blue-800 hover:text-blue-900"
          >
            Orders
          </Link>
          <Link
            to="/subscribedEbooks"
            className="font-medium text-blue-800 hover:text-blue-900"
          >
            Your Ebooks
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <div className="hidden lg:block relative group">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 py-2 pl-4 pr-10 bg-white/80 backdrop-blur-sm border-0 
                rounded-full shadow-sm transition-all duration-300
                focus:w-72 focus:shadow-sm focus:outline-none focus:ring-2 
                focus:ring-blue-900 group-hover:shadow-md"
              />
              <button 
                type="submit"
                className="absolute right-3 top-2.5"
              >
                <div
                  className="p-1 rounded-full text-gray-400 group-hover:text-indigo-500 
                  transition-colors duration-300"
                >
                  <AiOutlineSearch className="text-lg" />
                </div>
              </button>
            </form>
          </div>

          {/* Mobile Search Button */}
          <button
            className="lg:hidden p-2 text-gray-700 rounded-full 
            hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 
            transition-all duration-300"
            onClick={() => setMobileSearchOpen(true)}
          >
            <AiOutlineSearch className="text-xl" />
          </button>

          {/* Cart Button */}
          <button
            className="hidden sm:block p-2 text-blue-900 rounded-full hover:bg-gray-100 relative shadow-sm"
            onClick={handleCartClick}
          >
            <FaShoppingCart className="text-xl" />
            {currentUser && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Buttons */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img
                  src={currentUser.profilePicture}
                  alt="user"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm">@{currentUser.username}</p>
                    <p className="text-sm font-medium truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <Link
                    to="/dashboard?tab=profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="border-t"></div>
                  <button
                    onClick={handleSignout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <button className="px-4 py-2 bg-white bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 rounded-lg text-white hover:shadow-md transition-shadow duration-300">
                Sign In
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-2 border-t">
          <Link to="/" className="block py-2 text-gray-700">
            Home
          </Link>
          <Link to="/about" className="block py-2 text-gray-700">
            About
          </Link>
          <Link to="/orders" className="block py-2 text-gray-700">
            Orders
          </Link>
          <Link to="/subscribedEbooks" className="block py-2 text-gray-700">
            Your Ebooks
          </Link>
          <div className="py-2">
            <button
              className="flex items-center text-gray-700"
              onClick={handleCartClick}
            >
              <FaShoppingCart className="mr-2" />
              <span>Cart</span>
              {currentUser && cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16 px-4 animate-fadeIn">
          <div 
            ref={mobileSearchRef}
            className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-slideDown"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Search Books</h3>
                <button 
                  onClick={() => setMobileSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoCloseOutline className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full py-3 pl-4 pr-12 bg-gray-100 border-0 
                    rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <div className="p-1 rounded-full text-gray-500 hover:text-blue-800">
                    <AiOutlineSearch className="text-xl" />
                  </div>
                </button>
              </form>
              
              {/* Popular searches */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Popular searches</h4>
                <div className="flex flex-wrap gap-2">
                  {["Fiction", "Self-help", "Biography", "Science", "History"].map(term => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                        setMobileSearchOpen(false);
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}