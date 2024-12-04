import  { useEffect, useState }  from 'react'
import {  Heart, ShoppingCart, User, Menu,ArrowLeft } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import {assets} from '../../assets/assets'
import { useGetProfileQuery } from '../../services/userApi'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/userSlice/userSlice'
import LoadingModal from '../LoadingModal'

const Navbar = () => {
  const navigate=useNavigate()
  const {data:profile,error,isLoading}=useGetProfileQuery()
  const userProfile=profile?.userProfile
  const dispatch=useDispatch()
  useEffect(()=>{
    if(userProfile){
      dispatch(setUser(userProfile))
    }
  },[dispatch,userProfile])
  let userData=useSelector((state)=>state.user.userProfile)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
      }
      if(error){
        userData=null
      }
      if(isLoading){
        return<LoadingModal/>
      }
  return (
    <nav className=" sticky top-0 left-0 right-0 bg-navbarColor text-white pt-4 pb-2 z-50"> 
      <div className=" mx-10  flex items-baseline justify-between ">
        <div className="flex items-center space-x-4 max-w-[130px] max-h-[40px]">
            <img src={assets.logo} alt="" className='w-full h-auto max-w-xs'/>
        </div>
        
            <div className="hidden md:flex space-x-6  text-[12px]">
            <NavLink  to={'/'} className={({ isActive }) =>isActive ? 'text-yellow-400 hover:text-yellow-300' : 'text-white hover:text-yellow-300'}> HOME</NavLink>
            <NavLink to={'/products'} className={({ isActive }) =>isActive ? 'text-yellow-400 hover:text-yellow-300' : 'text-white hover:text-yellow-300'}>PRODUCTS</NavLink>
            {/* <NavLink to={'/category'} className={({ isActive }) =>isActive ? 'text-yellow-400 hover:text-yellow-300' : 'text-white hover:text-yellow-300'}>CATEGORY</NavLink> */}
            <NavLink to={'/contact-us'} className={({ isActive }) =>isActive ? 'text-yellow-400 hover:text-yellow-300' : 'text-white hover:text-yellow-300'}>CONTACT US</NavLink>
            <NavLink to={'/about-us'} className={({ isActive }) =>isActive ? 'text-yellow-400 hover:text-yellow-300' : 'text-white hover:text-yellow-300'}>ABOUT US</NavLink>
            </div>
            
            <div className="flex items-center space-x-3">
              
            <Heart size={15} onClick={()=>navigate('/account/wishlist')} className="text-gray-400  hover:text-yellow-400 cursor-pointer" />
            <ShoppingCart onClick={()=>{navigate('/view-cart')}} size={15} className="text-gray-400 hover:text-yellow-400 cursor-pointer" />
            <div className="flex items-center text-gray-400 hover:text-yellow-400 cursor-pointer">
                <User size={15} className="mr-1" />
                {userData?<NavLink to={'/account'} >{userData.firstName}</NavLink>:
                <NavLink to={'/login'} >Login</NavLink>
                }
            </div>
            <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
            <Menu size={24} />
            </button>
            </div>

            <div
  className={`fixed top-0 bottom-0 right-0 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
    isMenuOpen ? 'translate-x-0 w-64' : 'translate-x-full w-0'
  } h-screen`}
>
  <div className="flex flex-col text-gray-600 p-4">
    {/* Back button */}
    <div onClick={toggleMenu} className="flex items-center gap-3 cursor-pointer mb-4">
      <ArrowLeft size={15} />
      <p>Back</p>
    </div>

    {/* Sidebar navigation links */}
    <NavLink onClick={toggleMenu} className="py-2 pl-6 border-b border-gray-200" to={'/'}>
      HOME
    </NavLink>
    <NavLink onClick={toggleMenu} className="py-2 pl-6 border-b border-gray-200" to={'/products'}>
      PRODUCT
    </NavLink>
    <NavLink onClick={toggleMenu} className="py-2 pl-6 border-b border-gray-200" to={'/category'}>
      CATEGORY
    </NavLink>
    <NavLink onClick={toggleMenu} className="py-2 pl-6 border-b border-gray-200" to={'/contact-us'}>
      CONTACT US
    </NavLink>
    <NavLink onClick={toggleMenu} className="py-2 pl-6 border-b border-gray-200" to={'/about-us'}>
      ABOUT US
    </NavLink>
  </div>
</div>

            
       
      </div>
    </nav>
  )
}

export default Navbar
