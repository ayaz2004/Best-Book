import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiUser,
  HiBookOpen,
  HiShoppingBag,
  HiUserGroup,
  HiAcademicCap,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link to="/manage-user">
              <Sidebar.Item
                active={tab === "manage-user"}
                icon={HiUserGroup}
                as="div"
              >
                Manage User
              </Sidebar.Item>
            </Link>
          )}

          {currentUser && currentUser.isAdmin && (
            <Link to="/manage-books">
              <Sidebar.Item
                active={tab === "manage-books"}
                icon={HiBookOpen}
                as="div"
              >
                Manage Books
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to="/manage-quiz">
              <Sidebar.Item
                active={tab === "manage-quiz"}
                icon={HiAcademicCap}
                as="div"
              >
                Manage Quiz
              </Sidebar.Item>
            </Link>
          )}

          {currentUser && currentUser.isAdmin && (
            <Link to="/manage-order">
              <Sidebar.Item
                active={tab === "manage-order"}
                icon={HiShoppingBag}
                as="div"
              >
                Manage Orders
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
