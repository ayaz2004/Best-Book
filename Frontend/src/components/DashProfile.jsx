import { Alert, Button, Modal, TextInput } from "flowbite-react";
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

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  // Cloudinary Image Upload
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
        console.log("Uploaded successfully:", data.secure_url);
        return data.secure_url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setImageFileUploadError("Failed to upload image. Please try again.");
      return null;
    }
  };

  // Handle Image Change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = await uploadImagesToCloudinary(file);
      if (url) {
        setImageFileUrl(url); // Set the uploaded image URL
      } else {
        setImageFileUploadError("Failed to upload image. Please try again.");
      }
    }
  };

  // Handle Delete User
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

  // Handle Sign Out
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`, // Ensure the token is included
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

  // // Handle Form Submission (Update Profile)
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Implement your form submission logic here, for example:
  //   // You might want to send the updated profile to your backend API.
  //   console.log("Form submitted with data:", {
  //     username: e.target.username.value,
  //     phoneNumber: e.target.phoneNumber.value,
  //     password: e.target.password.value,
  //     profilePicture: imageFileUrl || currentUser.profilePicture, // Use uploaded image URL if available
  //   });
  // };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          // onChange={handleImageChange}
          // ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={
              imageFileUrl ||
              currentUser.profilePicture ||
              "/default-profile.png"
            }
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="text"
          id="phoneNumber"
          placeholder="phoneNumber"
          defaultValue={currentUser.phoneNumber}
        />
        <TextInput type="text" id="password" placeholder="*******" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-product"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Manage Books
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      {imageFileUploadError && (
        <Alert color="failure" className="mt-5">
          {imageFileUploadError}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
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
