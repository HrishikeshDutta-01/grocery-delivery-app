import { createContext, useContext, useState} from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user,  setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [Products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setsearchQuery] = useState({})
    // Fatch seller status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
             setIsSeller(false)
            
        }
    }
    // Fetch User Auth Status , User Data and cart Items
     const fetchUser = async()=>{
        try {
            const {data} = await axios.get('api/user/is-auth');
            if (data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
     }



    //Fetch All product
   const fetchProducts = async () => {
  try {
    const { data } = await axios.get("/api/product/list");
    console.log("Fetched products:", data);

    if (data.success) {
      // fallback: try multiple keys, default to empty array
      const productsArray = data.Products || data.products || data.data || [];
      setProducts(productsArray);
    } else {
      toast.error(data.message || "Failed to fetch products");
    }
  } catch (error) {
    toast.error(error.message);
  }
};


//Add product to cart
     const addToCart =(itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart")
    }

        //update cart items quantity
        const updateCartItem = (itemId,quantity)=>{
            let cartData = structuredClone(cartItems);
            cartData[itemId] = quantity;
            setCartItems(cartData)
            toast.success("cart updated")
        }

        //remove product from cart
        const removeFromCart = (itemId)=>{
            let cartData = structuredClone(cartItems);
            if(cartData[itemId]){
                cartData[itemId] -= 1;
                if(cartData[itemId]===0){
                    delete cartData[itemId];
                }
            }
            toast.success("Removed from Cart ")
            setCartItems(cartData)
        }


        // Get Cart Item Count
        const getCartCount =()=>{
            let totalCount =0;
            for(const item in cartItems){
                totalCount += cartItems[item];
            }
            return totalCount;
        }


        // Get Cart Total Amount
        const getCartAmount =()=>{
            let totalAmount = 0;
            for (const items in cartItems){
                let itemInfo = Products.find((product)=>product._id===items);
                if(cartItems[items]>0){
                    totalAmount += itemInfo.offerPrice * cartItems[items]
                }

            }
            return Math.floor(totalAmount*100)/100;

        }


    
     


    useEffect(()=>{
        fetchSeller()
        fetchProducts()
        fetchUser()
    },[])

    const value={navigate,user,setUser,setIsSeller,isSeller,showUserLogin,setShowUserLogin,products:Products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setsearchQuery,
             getCartCount,getCartAmount , axios , fetchProducts
    }

    return ( 
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}



// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = ()=>{
    return useContext(AppContext)
}