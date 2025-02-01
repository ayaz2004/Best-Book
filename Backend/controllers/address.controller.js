import Address from "../models/address.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

// Get User Addresses
export const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, "Unauthorized"));
    }

    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
      return next(errorHandler(404, "No addresses found"));
    }

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Add Address
export const addAddress = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, "Unauthorized"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const address = new Address({
      userId,
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      pincode,
      country,
    });

    await address.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Update Address
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const {
      firstName,
      lastName,
      phone,
      address1,
      address2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, "Unauthorized"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return next(errorHandler(404, "Address not found"));
    }

    if (address.userId.toString() !== userId.toString()) {
      return next(errorHandler(401, "Unauthorized"));
    }

    // Update address fields
    address.firstName = firstName;
    address.lastName = lastName;
    address.phone = phone;
    address.address1 = address1;
    address.address2 = address2;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.country = country;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Delete Address
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(errorHandler(401, "Unauthorized"));
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return next(errorHandler(404, "Address not found"));
    }

    if (address.userId.toString() !== userId.toString()) {
      return next(errorHandler(401, "Unauthorized"));
    }

    await Address.findByIdAndDelete(addressId);

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};