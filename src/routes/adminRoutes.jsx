import AdminDashboardPage from "../pages/adminPages/AdminDashboardPage.jsx"
import AdminLayout from "../components/adminComponents/AdminLayout.jsx"
import AdminLoginPage from "../pages/adminPages/AdminLoginPage.jsx"
import AdminUsersPage from "../pages/adminPages/AdminUsersPage.jsx"
import AdminProductsPage from "../pages/adminPages/AdminProductsPage.jsx"
import AdminCategoryPage from "../pages/adminPages/AdminCategoryPage.jsx"
import AdminAddProduct from "../components/adminComponents/AdminAddProduct.jsx"
import AdminEditProduct from "../components/adminComponents/AdminEditProduct.jsx"
import AdminAuth from "../utils/protectedRoutes/AdminAuth.jsx"
import AdminPrivate from "../utils/protectedRoutes/AdminPrivate.jsx"
import AdminOrdersPage from "../pages/adminPages/AdminOrdersPage.jsx"
import AdminCoupons from "../components/adminComponents/AdminCoupons.jsx"
import AdminOffers from "../components/adminComponents/AdminOffers.jsx"
import AdminAddOffer from "../components/adminComponents/AdminAddOffer.jsx"
import AdminSalesReport from "../components/adminComponents/AdminSalesReport.jsx"
// import AdminAuth from "../utils/protectedRoutes/AdminAuth.jsx"

const adminRoutes=[
    {
        path:'/admin/login',
        element:<AdminAuth><AdminLoginPage/></AdminAuth>
    },
    {
        path:'/admin',
        element:<AdminPrivate><AdminLayout/></AdminPrivate>,
        children:[
            {
                path:'',
                element:<AdminDashboardPage/>
            },
            {
                path:'users',
                element:<AdminUsersPage/>
            },
            {
                path:'products',
                element:<AdminProductsPage/>
            },
            {
                path:'products/add-product',
                element:<AdminAddProduct/>
            },
            {
                path:'products/edit-product/:product_id',
                element:<AdminEditProduct/>
            },
            {
                path:'category',
                element:<AdminCategoryPage/>
            },
            {
                path:'orders',
                element:<AdminOrdersPage/>
            },
            {
                path:'coupons',
                element:<AdminCoupons/>
            },
            {
                path:'offers',
                element:<AdminOffers/>
            },
            {
                path:'offers/add-offers',
                element:<AdminAddOffer/>
            },
            {
                path:'sales-report',
                element:<AdminSalesReport/>
            },
        ]
        
       
    }
]

export default adminRoutes
