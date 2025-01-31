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

// Add Address (with dynamic maxAddress check)
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

    // Check current number of addresses
    const existingAddresses = await Address.find({ userId });
    if (existingAddresses.length >= 3) {
      return next(errorHandler(400, "Maximum address limit reached"));
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

    await address.save({ validateBeforeSave: true });

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

    await address.save({validateBeforeSave: false});

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Delete Address (and allow adding a new address)
export const deleteAddress = async (req, res, next) => {
    try {
      const { addressId } = req.params;
      const userId = req.user?.id;
  
      // Check if user is authenticated
      if (!userId) {
        return next(errorHandler(401, "Unauthorized"));
      }
  
      // Find the address by ID
      const address = await Address.findById(addressId);
  
      // Check if the address exists
      if (!address) {
        return next(errorHandler(404, "Address not found"));
      }
  
      // Check if the address belongs to the authenticated user
      if (address.userId.toString() !== userId.toString()) {
        return next(errorHandler(401, "Unauthorized"));
      }
  
      // Delete the address
      await Address.findByIdAndDelete(addressId);
  
      return res.status(200).json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      next(errorHandler(500, error.message));
    }
  };
