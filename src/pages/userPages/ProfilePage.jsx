// import { ChevronRight } from '@mui/icons-material';
// import { Avatar } from '@mui/material';
// import { motion } from 'framer-motion';
// import { LogOut, NotebookPen, ShoppingCartIcon, User } from 'lucide-react';
// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { clearUser } from '../../redux/userSlice/userSlice';
// import { useLogOutMutation } from '../../services/userApi';
// import { toast } from 'sonner';
// const ProfilePage = () => {
//   const navigate=useNavigate()
//   const location=useLocation()
//   const dispatch=useDispatch()
//   const [logout]=useLogOutMutation()
//   const path=location.pathname.split('/')
//   const [activeItem,setActiveItem]=useState(path[path.length-1])
//   const userProfile=useSelector(state=>state.user.userProfile)
//   const handleOption=(item)=>{
//     setActiveItem(item)
//     if(item=='account'){
//       navigate('/account')
//     }else{
//       navigate(`/account/${item}`)
//     }
//   }

//   const handleLogOut=async()=>{
//     await logout()
//     localStorage.removeItem('userToken')
//     dispatch(clearUser())
//     toast.success('Logout Succesfully')
//     navigate('/')
//   }
//   return (
//     <motion.div 
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.5 }}
//    className="flex min-h-screen py-8  px-20 bg-bodyColor"
//   >
//     <div className='flex flex-col w-2/5'>
//     {/* avatar and username */}
//     <div className='bg-white shadow-md flex flex-row rounded-sm  h-24 '>
//     <Avatar sx={{width: 60, height: 60, m:2,backgroundColor:'#374151'}}>{userProfile?.firstName ? userProfile.firstName.charAt(0):'A'}</Avatar>
//     <div className='ml-3 pt-4'>
//     <h5 className='text-sm'>Hello,</h5>
//     <h1 className='text-lg font-bold'>
//     {userProfile.firstName}  {userProfile.lastName}
//     </h1>
//     </div>
//     </div>
//     {/* other options */}
//     <div className='bg-white shadow-md flex flex-col rounded-sm mt-6 h-[492px]'>

//       {/* for orders */}
//     <div onClick={()=>handleOption('orders')} className='flex flex-row h-20 border-b-2 w-full cursor-pointer  items-center'>
//       <ShoppingCartIcon className='ml-7 text-navbarColor'/>
//     <h1 className={`ml-10 text-lg font-bold ${activeItem=='orders'?'text-navbarColor':'text-gray-500'}  hover:text-navbarColor`}>MY ORDERS</h1>
//       <ChevronRight className='ml-auto mr-6'/>
//     </div>

// {/* address settings */}
//     <div className='flex flex-col border-b-2 '>
//        <div  className='flex flex-row h-14  w-full cursor-pointer  items-center'>
//           <User className='ml-7 text-navbarColor'/>
//         <h1 className='ml-10 text-lg font-bold text-gray-500'>ADDRESS SETTINGS</h1>
//         </div>
//        {/* for personal info */}
//         <div onClick={()=>handleOption('account')} className='flex flex-row h-14 w-full  cursor-pointer items-center'>
//         <h1 className={` text-sm pl-[6rem] font-medium ${activeItem=='account'?'text-navbarColor':'text-gray-500'}  hover:text-navbarColor`}>Personal Information</h1>
//         </div>
//         {/* for manage address */}
//         <div onClick={()=>handleOption('address')} className='flex flex-row h-14  w-full cursor-pointer items-center'>
//         <h1 className={` text-sm pl-[6rem] font-medium ${activeItem=='address'?'text-navbarColor':'text-gray-500'}  hover:text-navbarColor`}>Address Management</h1>
//         </div>
//     </div>

//     {/* my stuff */}
//     <div className='flex flex-col border-b-2 '>
//        <div  className='flex flex-row h-14  w-full cursor-pointer  items-center'>
//           <NotebookPen className='ml-7 text-navbarColor'/>
//         <h1 className='ml-10 text-lg font-bold text-gray-500'>MY STUFFS</h1>
//         </div>
//        {/* for coupons */}
//         <div onClick={()=>handleOption('coupons')} className='flex flex-row h-14 w-full  cursor-pointer items-center'>
//         <h1 className={` text-sm pl-[6rem] font-medium ${activeItem=='coupons'?'text-navbarColor':'text-gray-500'}  hover:text-navbarColor`}>My Coupons</h1>
//         </div>
//         {/* for manage wishlist */}
//         <div onClick={()=>handleOption('wishlist')} className='flex flex-row h-14  w-full cursor-pointer items-center'>
//         <h1 className={` text-sm pl-[6rem] font-medium ${activeItem=='wishlist'?'text-navbarColor':'text-gray-500'}  hover:text-navbarColor`}>My Wishlist</h1>
//         </div>
//         {/* for manage wallet */}
//         <div onClick={()=>handleOption('wallet')} className='flex flex-row h-14  w-full cursor-pointer items-center'>
//         <h1 className={` text-sm pl-[6rem] font-medium ${activeItem=='wallet'?'text-navbarColor':'text-gray-500'}  hover:text-navbarColor`}>My Wallet</h1>
//         </div>
//     </div>
//     </div>
//     {/* for log out */}
//     <div onClick={handleLogOut} className='bg-white shadow-md flex flex-row h-20 border-t-2 w-full cursor-pointer items-center '>
//       <LogOut className='ml-7 text-navbarColor'/>
//     <h1 className={`ml-10 text-lg font-bold text-gray-500  hover:text-navbarColor`}>Log Out</h1>
//     </div>
//     </div>
//     <Outlet/>
   






//   </motion.div>
//   )
// }

// export default ProfilePage


import { ChevronRight } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { LogOut, NotebookPen, ShoppingCartIcon, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearUser } from '../../redux/userSlice/userSlice';
import { useLogOutMutation } from '../../services/userApi';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [logout] = useLogOutMutation()
  const path = location.pathname.split('/')
  const [activeItem, setActiveItem] = useState(path[path.length - 1])
  const userProfile = useSelector(state => state.user.userProfile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleOption = (item) => {
    setActiveItem(item)
    if (item == 'account') {
      navigate('/account')
    } else {
      navigate(`/account/${item}`)
    }
    setIsMobileMenuOpen(false)
  }

  const handleLogOut = async () => {
    await logout()
    localStorage.removeItem('userToken')
    dispatch(clearUser())
    toast.success('Logout Successfully')
    navigate('/')
  }

  const SidebarContent = () => (
    <div className='flex flex-col w-full '>
      {/* avatar and username */}
      <div className='bg-white shadow-md flex flex-row rounded-sm h-24'>
        <Avatar sx={{ width: 60, height: 60, m: 2, backgroundColor: '#374151' }}>{userProfile?.firstName ? userProfile.firstName.charAt(0) : 'A'}</Avatar>
        <div className='ml-3 pt-4'>
          <h5 className='text-sm'>Hello,</h5>
          <h1 className='text-lg font-bold'>
            {userProfile.firstName} {userProfile.lastName}
          </h1>
        </div>
      </div>
      {/* other options */}
      <div className='bg-white shadow-md flex flex-col rounded-sm mt-6 h-[492px]'>
        {/* for orders */}
        <div onClick={() => handleOption('orders')} className='flex flex-row h-20 border-b-2 w-full cursor-pointer items-center'>
          <ShoppingCartIcon className='ml-7 text-navbarColor' />
          <h1 className={`ml-10 text-lg font-bold ${activeItem == 'orders' ? 'text-navbarColor' : 'text-gray-500'} hover:text-navbarColor`}>MY ORDERS</h1>
          <ChevronRight className='ml-auto mr-6' />
        </div>
        {/* address settings */}
        <div className='flex flex-col border-b-2'>
          <div className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <User className='ml-7 text-navbarColor' />
            <h1 className='ml-10 text-lg font-bold text-gray-500'>ACCOUNT SETTINGS</h1>
          </div>
          {/* for personal info */}
          <div onClick={() => handleOption('account')} className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <h1 className={`text-sm pl-[6rem] font-medium ${activeItem == 'account' ? 'text-navbarColor' : 'text-gray-500'} hover:text-navbarColor`}>Personal Information</h1>
          </div>
          {/* for manage address */}
          <div onClick={() => handleOption('address')} className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <h1 className={`text-sm pl-[6rem] font-medium ${activeItem == 'address' ? 'text-navbarColor' : 'text-gray-500'} hover:text-navbarColor`}>Address Management</h1>
          </div>
        </div>
        {/* my stuff */}
        <div className='flex flex-col border-b-2'>
          <div className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <NotebookPen className='ml-7 text-navbarColor' />
            <h1 className='ml-10 text-lg font-bold text-gray-500'>MY STUFFS</h1>
          </div>
          {/* for coupons */}
          <div onClick={() => handleOption('coupons')} className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <h1 className={`text-sm pl-[6rem] font-medium ${activeItem == 'coupons' ? 'text-navbarColor' : 'text-gray-500'} hover:text-navbarColor`}>My Coupons</h1>
          </div>
          {/* for manage wishlist */}
          <div onClick={() => handleOption('wishlist')} className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <h1 className={`text-sm pl-[6rem] font-medium ${activeItem == 'wishlist' ? 'text-navbarColor' : 'text-gray-500'} hover:text-navbarColor`}>My Wishlist</h1>
          </div>
          {/* for manage wallet */}
          <div onClick={() => handleOption('wallet')} className='flex flex-row h-14 w-full cursor-pointer items-center'>
            <h1 className={`text-sm pl-[6rem] font-medium ${activeItem == 'wallet' ? 'text-navbarColor' : 'text-gray-500'} hover:text-navbarColor`}>My Wallet</h1>
          </div>
        </div>
      </div>
      {/* for log out */}
      <div onClick={handleLogOut} className='bg-white shadow-md flex flex-row h-20 border-t-2 w-full cursor-pointer items-center'>
        <LogOut className='ml-7 text-navbarColor' />
        <h1 className={`ml-10 text-lg font-bold text-gray-500 hover:text-navbarColor`}>Log Out</h1>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row min-h-screen py-8 px-4 md:px-20 bg-bodyColor"
    >
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-md shadow-md"
        >
          <Menu className="h-6 w-6 text-navbarColor" />
        </button>
      </div>
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-1/3`}>
        <SidebarContent />
      </div>
      <div className="w-full min-h-screen md:w-4/5">
        <Outlet />
      </div>
    </motion.div>
  )
}

export default ProfilePage
