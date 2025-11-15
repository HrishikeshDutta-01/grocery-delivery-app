import jwt from 'jsonwebtoken';

// Login Seller ; /api/seller/login

export const sellerLogin = async(req, res,)=>{
   try {
     const { email, password }= req.body;

    if(password === process.env.SELLER_PASSWORD && email=== process.env.SELLER_EMAIL){
        // inside sellerLogin
const token = jwt.sign(
  { email, isSeller: true },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);


         res.cookie('sellerToken', token,{
            httpOnly: true,// prevent javascript to access cookie
            secure: process.env.NODE_ENV ==='production', // use secure cookie in production
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict', // CSRF protection 
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
        });

        return res.json({success: true, message: 'Logged In'});

    }else{
        return res.json({ success: false, message: "Invalid Credentials"});
    }
   } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
    
   }
}

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        if (!req.user.isSeller) {
            return res.status(403).json({ success: false, message: "Access denied. Not a seller" });
        }

        return res.json({ success: true, user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Logout Seller : /api/seller/logout

export const sellerlogout = async(req, res)=>{
    try{
        res.clearCookie('sellerToken',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged out" })
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });

    }
}
