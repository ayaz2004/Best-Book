import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge, Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  HiOutlinePhotograph,
  HiPlus,
  HiTrash,
  HiCheck,
  HiX,
  HiRefresh,
} from "react-icons/hi";

export default function AdminBannerDashboard() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const fileInputRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [targetExams, setTargetExams] = useState([]);
  const [examInput, setExamInput] = useState("");

  useEffect(() => {
    if (currentUser?.accessToken) fetchBanners();
  }, [currentUser]);

  const fetchBanners = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/banners/allBanners", {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      // Log response status for debugging
      console.log("Response status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch banners");
      }

      setBanners(data.banners);
      calculateStatistics(data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (bannerData) => {
    const stats = {
      total: bannerData.length,
      active: bannerData.filter((banner) => banner.isActive).length,
      inactive: bannerData.filter((banner) => !banner.isActive).length,
    };
    setStatistics(stats);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleToggleActive = async (bannerId, isCurrentlyActive) => {
    try {
      setError(null);

      const res = await fetch(`/api/banners/toggleBanner/${bannerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update banner status");
      }

      // Update the banner in state
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner._id === bannerId
            ? { ...banner, isActive: data.isActive }
            : banner
        )
      );

      // Update statistics
      calculateStatistics(
        banners.map((banner) =>
          banner._id === bannerId
            ? { ...banner, isActive: data.isActive }
            : banner
        )
      );
    } catch (error) {
      console.error("Error updating banner status:", error);
      setError(error.message);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      setError(null);

      const res = await fetch(`/api/banners/deleteBanner/${bannerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete banner");
      }

      // Remove the banner from state
      setBanners((prevBanners) =>
        prevBanners.filter((banner) => banner._id !== bannerId)
      );

      // Update statistics
      calculateStatistics(banners.filter((banner) => banner._id !== bannerId));
    } catch (error) {
      console.error("Error deleting banner:", error);
      setError(error.message);
    }
  };

  const handleAddExam = () => {
    if (examInput.trim() !== "" && !targetExams.includes(examInput.trim())) {
      setTargetExams([...targetExams, examInput.trim()]);
      setExamInput("");
    }
  };

  const handleRemoveExam = (exam) => {
    setTargetExams(targetExams.filter((e) => e !== exam));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];

    if (!file) {
      setError("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("banners", file);
      formData.append("redirectUrl", redirectUrl);
      formData.append("targetExams", JSON.stringify(targetExams));

      const res = await fetch("/api/banners/uploadbanners", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload banner");
      }

      setShowAddModal(false);
      setPreview(null);
      setRedirectUrl("");
      setTargetExams([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh banners
      fetchBanners();
    } catch (error) {
      console.error("Error uploading banner:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-200 to-purple-200 py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 space-y-6"
      >
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center">
              <HiOutlinePhotograph className="w-10 h-10 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Banners</p>
                <h3 className="text-xl font-bold">{statistics.total}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <HiCheck className="w-10 h-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Banners</p>
                <h3 className="text-xl font-bold">{statistics.active}</h3>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <HiX className="w-10 h-10 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Inactive Banners</p>
                <h3 className="text-xl font-bold">{statistics.inactive}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Manage Banners</h2>
          <div className="flex gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={() => setShowAddModal(true)}
            >
              <HiPlus className="mr-2" /> Add New Banner
            </Button>
            <Button color="light" onClick={fetchBanners}>
              <HiRefresh className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Banners Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p>Loading banners...</p>
          ) : banners.length > 0 ? (
            banners.map((banner) => (
              <Card key={banner._id} className="overflow-hidden">
                <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    color={banner.isActive ? "success" : "gray"}
                    className="absolute top-2 right-2"
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  {/* Redirect URL */}
                  {banner.redirectUrl && (
                    <p className="text-sm truncate text-blue-600">
                      <span className="text-gray-500 font-medium">URL:</span>{" "}
                      <a
                        href={banner.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {banner.redirectUrl.length > 25
                          ? banner.redirectUrl.substring(0, 25) + "..."
                          : banner.redirectUrl}
                      </a>
                    </p>
                  )}

                  {/* Target Exams */}
                  {banner.targetExams && banner.targetExams.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs text-gray-500 font-medium">
                        Exams:
                      </span>
                      {banner.targetExams.map((exam) => (
                        <Badge key={exam} color="purple" className="text-xs">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">ID: {banner._id}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="xs"
                        color={banner.isActive ? "warning" : "success"}
                        onClick={() =>
                          handleToggleActive(banner._id, banner.isActive)
                        }
                      >
                        {banner.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDeleteBanner(banner._id)}
                      >
                        <HiTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-center py-4">
                No banners found. Add your first banner!
              </p>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Add Banner Modal */}
      <Modal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setPreview(null);
          setRedirectUrl("");
          setTargetExams([]);
          setError(null);
        }}
      >
        <Modal.Header>Add New Banner</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Banner Image</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />

              {preview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <div className="h-40 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={preview}
                      alt="Banner preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Redirect URL Field */}
              <div className="mt-4">
                <label className="text-sm font-medium">Redirect URL</label>
                <input
                  type="url"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Where users will go when they click on this banner
                </p>
              </div>

              {/* Target Exams Field */}
              <div className="mt-4">
                <label className="text-sm font-medium">Target Exams</label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={examInput}
                    onChange={(e) => setExamInput(e.target.value)}
                    placeholder="Add exam (e.g. JEE, NEET)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddExam();
                      }
                    }}
                  />
                  <Button
                    color="purple"
                    onClick={handleAddExam}
                    className="rounded-l-none"
                  >
                    Add
                  </Button>
                </div>

                {/* Display selected exams */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {targetExams.map((exam) => (
                    <Badge
                      key={exam}
                      color="purple"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {exam}
                      <button
                        type="button"
                        onClick={() => handleRemoveExam(exam)}
                        className="ml-1 text-xs font-medium text-purple-800 hover:text-purple-900"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-2 bg-red-100 text-red-700 text-sm rounded mt-2">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                color="gray"
                onClick={() => {
                  setShowAddModal(false);
                  setPreview(null);
                  setRedirectUrl("");
                  setTargetExams([]);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                type="submit"
                isProcessing={uploading}
                disabled={!preview || uploading}
              >
                Upload Banner
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
