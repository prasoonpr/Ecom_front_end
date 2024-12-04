import { Outlet } from "react-router-dom";
import Navbar from "../components/userComponents/Navbar";
import HomePage from "../pages/userPages/HomePage";
import LoginPage from "../pages/userPages/LoginPage";
import SignupPage from "../pages/userPages/SignupPage";
import ProductsPage from "../pages/userPages/ProductsPage";
import ContactPage from "../pages/userPages/ContactPage";
import AboutPage from "../pages/userPages/AboutPage";
import VerifyOtpPage from "../pages/userPages/VerifyOtpPage";
import ProfilePage from "../pages/userPages/ProfilePage";
import Authenticated from "../utils/protectedRoutes/Authenticated";
import ProductDetailsPage from "../pages/userPages/ProductDetailsPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AddressManage from "../components/userComponents/AddressManage";
import Profile from "../components/userComponents/Profile";
import Orders from "../components/userComponents/Orders";
import UserPrivate from "../utils/protectedRoutes/UserPrivate";
import Cart from "../components/userComponents/Cart";
import CheckOutPage from "../pages/userPages/CheckOutPage";
import CheckoutProtect from "../utils/protectedRoutes/CheckoutProtect";
import { ScrollToTop } from "../components/ScrollToTop";
import Coupons from "../components/userComponents/Coupons";
import Wishlist from "../components/userComponents/Wishlist";
import Wallet from "../components/userComponents/Wallet";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const userRoutes=[
    {
        path:'/',
        element:(
            <>
            <Navbar/>
            <ScrollToTop/>
            <Outlet/>
            </>
        ),
        children:[
            {
                path:'',
                element:<HomePage/>
            },
            {
                path:'login',
                element:<Authenticated>
                            <GoogleOAuthProvider clientId={clientId}>
                                <LoginPage/>
                            </GoogleOAuthProvider>
                        </Authenticated>
            },
            {
                path:'verify-user',
                element:<Authenticated><VerifyOtpPage/></Authenticated>
            },
            {
                path:'signup',
                element:<Authenticated><SignupPage/></Authenticated>
            },
            {
                path:'products',
                element:<ProductsPage/>,
            },
           
            {
                path:'products/product-details/:product_id',
                element:<ProductDetailsPage/>
            },
            {
                path:'contact-us',
                element:<ContactPage/>
            },
            {
                path:'about-us',
                element:<AboutPage/>
            },
            {
                path:'account',
                element:<UserPrivate><ProfilePage/></UserPrivate>,
                children:[
                    {
                        path:'',
                        element:<Profile/>
                    },
                    {
                        path:'address',
                        element:<AddressManage/>
                    },
                    {
                        path:'orders',
                        element:<Orders/>
                    },
                    {
                        path:'coupons',
                        element:<Coupons/>
                    },
                    {
                        path:'wishlist',
                        element:<Wishlist/>
                    },
                    {
                        path:'wallet',
                        element:<Wallet/>
                    },
                ]
            },
            {
                path:'view-cart',
                element:<UserPrivate><Cart/></UserPrivate>
            },
            {
                path:'check-out',
                element:<UserPrivate>
                            <CheckoutProtect>
                                <CheckOutPage/>
                             </CheckoutProtect>
                        </UserPrivate>
            },
          
           
        ]
    }
]

export default userRoutes