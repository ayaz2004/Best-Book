import { useState, useEffect, useRef } from "react";
import { Card, Table, Button, Badge, Modal } from "flowbite-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  HiOutlinePhotograph,
  HiPlus,
  HiEye,
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

  useEffect(() => {
    if (currentUser?.accessToken) fetchBanners();
  }, [currentUser]);

  const fetchBanners = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/banners/topBanners");
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

  const handleToggleActive = async (bannerId, isCurrentlyActive) => {
    // Placeholder for toggle active/inactive functionality
    // This would require a backend endpoint to update banner status
    console.log(`Toggle banner ${bannerId} to ${!isCurrentlyActive}`);
  };

  const handleDeleteBanner = async (bannerId) => {
    // Placeholder for delete banner functionality
    // This would require a backend endpoint to delete a banner
    console.log(`Delete banner ${bannerId}`);
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
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(banner.createdAt).toLocaleDateString()}
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
