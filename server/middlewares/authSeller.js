import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (!decoded.isSeller || decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({ success: false, message: "Access denied. Not a seller" });
    }

    // attach seller info to request
    req.user = { email: decoded.email, isSeller: true };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authSeller;
