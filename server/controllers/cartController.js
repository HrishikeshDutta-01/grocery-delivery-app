
import User from "../models/user.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: "Invalid cart items" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true }
    );

    res.json({ success: true, message: "Cart updated", cartItems: updatedUser.cartItems });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

