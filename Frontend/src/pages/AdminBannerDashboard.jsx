import { useState, useEffect, useRef } from "react";
import { Badge, Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  HiOutlinePhotograph,
  HiPlus,
  HiTrash,
  HiCheck,
  HiX,
  HiRefresh,
  HiPhotograph,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-purple-50 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <HiPhotograph className="text-3xl" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Admin Dashboard - Manage Banners
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow"
            disabled={loading}
          >
            <HiPlus className="text-xl" />
            Add New Banner
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <HiOutlinePhotograph className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Banners</p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.total}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white">
              <HiCheck className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">
                Active Banners
              </p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.active}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white">
              <HiX className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">
                Inactive Banners
              </p>
              <h3 className="text-2xl font-bold text-blue-900">
                {statistics.inactive}
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Button Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-bold text-blue-900">
            {loading
              ? "Loading banners..."
              : `${statistics.total} Banner${
                  statistics.total === 1 ? "" : "s"
                } Found`}
          </h2>
          <p className="text-sm text-gray-500">
            {statistics.active} active, {statistics.inactive} inactive
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBanners}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            disabled={loading}
          >
            <HiRefresh className="text-xl" />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg text-red-700"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <HiX className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Banners Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : banners.length > 0 ? (
            banners.map((banner, index) => (
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-0 left-0 w-full h-full ${
                      banner.isActive
                        ? "bg-gradient-to-t from-green-900/20 to-transparent"
                        : "bg-gradient-to-t from-gray-900/20 to-transparent"
                    }`}
                  ></div>
                  <Badge
                    color={banner.isActive ? "success" : "gray"}
                    className="absolute top-3 right-3"
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="p-4 space-y-2">
                  {/* Target Exams */}
                  {banner.targetExams && banner.targetExams.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1.5">
                        Target Exams:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {banner.targetExams.map((exam) => (
                          <Badge
                            key={exam}
                            color="purple"
                            className="bg-purple-100 text-xs"
                          >
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Redirect URL */}
                  {banner.redirectUrl && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-600 font-medium mb-0.5">
                        Redirect URL:
                      </p>
                      <a
                        href={banner.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                      >
                        {banner.redirectUrl.length > 35
                          ? banner.redirectUrl.substring(0, 35) + "..."
                          : banner.redirectUrl}
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                    <p className="text-xs text-gray-500">
                      Created on{" "}
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleToggleActive(banner._id, banner.isActive)
                        }
                        className={`px-3 py-1 text-xs font-medium rounded-lg ${
                          banner.isActive
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {banner.isActive ? "Disable" : "Enable"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteBanner(banner._id)}
                        className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium"
                      >
                        <HiTrash className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-white rounded-xl border-2 border-dashed border-blue-200 p-8 text-center"
            >
              <HiOutlinePhotograph className="mx-auto h-12 w-12 text-blue-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No banners found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new banner
              </p>
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center"
                >
                  <HiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Banner
                </motion.button>
              </div>
            </motion.div>
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
          if (preview) URL.revokeObjectURL(preview);
        }}
        size="xl"
        className="!bg-blue-900/20 backdrop-blur-sm"
      >
        <Modal.Header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white border-none">
          <span className="text-xl font-bold">Add New Banner</span>
        </Modal.Header>
        <Modal.Body className="bg-white space-y-6 overflow-y-auto max-h-[70vh] p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* Banner Image Upload */}
            <div className="space-y-2">
              <label className="text-blue-900 font-medium">Banner Image</label>
              <div className="relative h-48 bg-purple-50 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors overflow-hidden">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Banner preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <HiOutlinePhotograph className="w-12 h-12 text-purple-400" />
                    <p className="mt-2 text-sm text-purple-600">
                      Click to upload a banner image
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Redirect URL Field */}
            <div className="space-y-2">
              <label className="text-blue-900 font-medium">Redirect URL</label>
              <input
                type="url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">
                Where users will go when they click on this banner
              </p>
            </div>

            {/* Target Exams Field */}
            <div className="space-y-2">
              <label className="text-blue-900 font-medium">Target Exams</label>
              <div className="flex">
                <input
                  type="text"
                  value={examInput}
                  onChange={(e) => setExamInput(e.target.value)}
                  placeholder="Add exam (e.g. JEE, NEET)"
                  className="w-full pl-4 pr-4 py-2.5 border-2 border-purple-200 rounded-l-xl focus:border-blue-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExam();
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleAddExam}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-r-xl"
                >
                  Add
                </motion.button>
              </div>

              {/* Display selected exams */}
              <div className="flex flex-wrap gap-2 mt-3">
                {targetExams.length === 0 ? (
                  <p className="text-sm text-gray-500">No exams selected</p>
                ) : (
                  targetExams.map((exam) => (
                    <Badge
                      key={exam}
                      color="purple"
                      className="flex items-center gap-1 px-3 py-1.5"
                    >
                      {exam}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleRemoveExam(exam)}
                        className="ml-1.5 bg-purple-200 rounded-full p-0.5 text-purple-800"
                      >
                        <HiX className="w-3 h-3" />
                      </motion.button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border-l-4 border-red-500">
                {error}
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAddModal(false);
                setPreview(null);
                setRedirectUrl("");
                setTargetExams([]);
                setError(null);
                if (preview) URL.revokeObjectURL(preview);
              }}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              disabled={!preview || uploading}
            >
              {uploading ? (
                <>
                  <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                "Upload Banner"
              )}
            </motion.button>
          </div>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}
