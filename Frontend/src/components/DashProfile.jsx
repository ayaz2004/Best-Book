import { Alert, Button, Card, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaUser, FaPhone, FaLock } from "react-icons/fa";
import { motion } from "framer-motion"; // Import Framer Motion

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const uploadImagesToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profilePicture");
    formData.append("cloud_name", "dniu1zxdq");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dniu1zxdq/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      setImageFileUploadError("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = await uploadImagesToCloudinary(file);
      if (url) {
        setImageFileUrl(url);
      } else {
        setImageFileUploadError("Failed to upload image. Please try again.");
      }
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    const confirmSignout = window.confirm("Are you sure you want to sign out?");
    if (confirmSignout) {
      try {
        const res = await fetch("/api/user/signout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-200 to-purple-200 py-10 w-full relative overflow-hidden">
      {/* Glass Morphism Background with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-white/10 backdrop-blur-lg"
      />

      {/* Profile Card with Framer Motion */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white/30 backdrop-blur-md border border-white/10 relative z-10"
      >
        <div className="bg-purple-600 text-white py-4 rounded-t-lg">
          <h1 className="text-center text-3xl font-semibold">My Profile</h1>
        </div>
        <form className="flex flex-col gap-4 mt-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full hover:shadow-lg transition-shadow duration-300"
            onClick={() => filePickerRef.current.click()}
          >
            <img
              src={
                imageFileUrl ||
                currentUser.profilePicture ||
                "https://via.placeholder.com/150"
              }
              alt="user"
              className="rounded-full w-full h-full object-cover border-4 border-purple-200 hover:border-purple-500 transition-all duration-300"
            />
          </div>
          <TextInput
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            icon={FaUser}
          />
          <TextInput
            type="text"
            id="phoneNumber"
            placeholder="Phone Number"
            defaultValue={currentUser.phoneNumber}
            icon={FaPhone}
          />
          <TextInput
            type="password"
            id="password"
            placeholder="*******"
            icon={FaLock}
          />
          <div className="grid grid-cols-2 gap-4 mt-5">
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Update Profile
            </Button>
            {currentUser.isAdmin && (
              <Link to={"/create-product"}>
                <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
                  Manage Books
                </Button>
              </Link>
            )}
          </div>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span onClick={() => setShowModal(true)} className="cursor-pointer hover:underline">
            Delete Account
          </span>
          <span onClick={handleSignout} className="cursor-pointer hover:underline">
            Sign Out
          </span>
        </div>
        {error && <Alert color="failure" className="mt-5">{error}</Alert>}
        {imageFileUploadError && <Alert color="failure" className="mt-5">{imageFileUploadError}</Alert>}
        <div className="mt-6 text-center text-gray-600">
          <p>Joined on: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      </motion.div>

      {/* Modal for Delete Confirmation */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}