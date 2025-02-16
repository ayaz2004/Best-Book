import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
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

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Best Book
        </span>
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline relative"
          color="gray"
          pill
          onClick={handleCartClick}
        >
          <FaShoppingCart />
          {currentUser && cartCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {cartCount}
            </div>
          )}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link to="/orders">Orders</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link to="/subscribedEbooks">Your Ebooks</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
