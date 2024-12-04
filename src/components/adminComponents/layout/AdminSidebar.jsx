import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  Category as CategoriesIcon,
  LocalOffer as CouponsIcon,
  ViewCarousel as BannersIcon,
  Payment as PaymentsIcon,
  LocalOffer as OffersIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const sidebarItems = [
  { name: 'Dashboard', icon: <DashboardIcon sx={{color:'#FACC15'}} />,path:'/admin' },
  { name: 'Orders', icon: <OrdersIcon sx={{color:'#FACC15'}}/>,path:'/admin/orders' },
  { name: 'Products', icon: <ProductsIcon sx={{color:'#FACC15'}} />,path:'/admin/products' },
  { name: 'Users', icon: <UsersIcon sx={{color:'#FACC15'}}/> ,path:'/admin/users'},
  { name: 'Categories', icon: <CategoriesIcon sx={{color:'#FACC15'}}/> ,path:'/admin/category'},
  { name: 'Coupons', icon: <CouponsIcon sx={{color:'#FACC15'}}/> , path:'/admin/coupons' },
  { name: 'Banners', icon: <BannersIcon sx={{color:'#FACC15'}}/> },
  { name: 'Payments', icon: <PaymentsIcon sx={{color:'#FACC15'}}/> },
  { name: 'Offers', icon: <OffersIcon sx={{color:'#FACC15'}}/> ,path:'/admin/offers'},
  { name: 'Sales Report', icon: <OffersIcon sx={{color:'#FACC15'}}/> ,path:'/admin/sales-report'},
];
const AdminSidebar = () => {
  const navigate=useNavigate()
  const location=useLocation()  
  const handlePath=(path)=>{
    navigate(path)
  }
    return (
        <motion.div 
          className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-16 z-50"
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <List>
            {sidebarItems.map((item) => {
              const isActive=location.pathname===item.path;
              return(
                <ListItem 
                button
                onClick={()=>{handlePath(item.path)}}
                key={item.name}
                className="hover:bg-gray-800 transition-colors duration-200 border-b border-gray-700 cursor-pointer" >
                <ListItemIcon className="text-yellow-400">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} className={isActive&& "text-yellow-400"} />
              </ListItem>
            )})}
          
            </List>
            </motion.div>
          );
}

export default AdminSidebar
