import  {  useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Rating, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {useGetActiveCategoryQuery} from '../../services/adminApi'
import { useGetProductsForHomeQuery } from '../../services/userApi';
import { useNavigate } from 'react-router-dom';

const banners = [
  { id: 1, title: "NEW COLLECTION 'DIAMOND'", image: "https://png.pngtree.com/thumb_back/fh260/background/20230705/pngtree-softly-focused-bokeh-3d-render-of-falling-ruby-gem-and-diamond-image_3728631.jpg?height=300&width=1000" },
  { id: 2, title: "EXCLUSIVE SAPPHIRE SERIES", image: "https://www.madhavgems.com/image/catalog/menu/precious-stone-banner.jpg?height=300&width=1000" },
  { id: 3, title: "ELEGANT PEARL COLLECTION", image: "https://www.shinestones.com/image/catalog/sapphire-baBanner.jpg?height=300&width=1000" },
];
const Home = () => {
  const navigate=useNavigate()
  const [currentBanner, setCurrentBanner] = useState(0);
  const {data:category}=useGetActiveCategoryQuery()
  const {data}=useGetProductsForHomeQuery()
  const [products,setProducts]=useState([])
  const [activeCategory,setActiveCategory]=useState([])
useEffect(()=>{
  if(category?.categoryList){
    setActiveCategory([...category.categoryList])
  }
  if(data?.products){
    setProducts([...data.products])
  }
},[category,data])
  //for banners
  setTimeout(()=>{
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  },4000)
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };
  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
      <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#E5E7EB]"
        >
      {/* Hero Section with Framer Motion */}
      <div className="relative h-[300px] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
           <img
              src={banners[currentBanner].image}
              alt={banners[currentBanner].title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start p-20">
              <Typography variant="h3" component="h1" className="text-white  mb-4">
                {banners[currentBanner].title}
              </Typography>
              <Button variant="outlined" className="text-white border-white hover:text-yellow-400 hover:border-yellow-400 ">
                SHOP NOW
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="container mx-auto mt-8 px-4">
        {/* Feature Boxes */}
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {activeCategory.slice(0, 3).map((gem,index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold mb-2">{gem.category}</h3>
              <p className="text-gray-600">{gem.description}</p>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <h2 className="text-2xl font-bold mb-4">Top Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {products.slice(0,4).map((item,index) => {
             const totalStars=item.review.reduce((acc,obj)=>acc+obj.star,0)
             const avgStar=Math.round(totalStars/item.review.length)
            return(
            <div onClick={()=>navigate('/products')} key={index} className="bg-white cursor-pointer p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <img
                src={item.images[0]}
                alt={`Product `}
                width={150}
                height={150}
                className="mb-2 mx-auto"
              />
              <p className="font-bold">{item.productName}</p>
              <p className="text-gray-600">${item.price}</p>
              <Rating value={avgStar} readOnly size="small" />
            </div>
            )
          })}
        </div>

        {/* Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-700 text-white p-4 rounded-lg">
            <p className="text-lg font-bold">20% OFF on All Natural Gemstones</p>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-lg">
            <p className="text-lg font-bold">100% 3D Jewelry Customization</p>
          </div>
        </div>

        {/* Exclusive Natural Gemstone */}
        <h2 className="text-2xl font-bold mb-4">Exclusive Natural Gemstone</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {products.slice(4,8).map((gem,index) => (
            <div key={index} onClick={()=>navigate('/products')} className="text-center cursor-pointer">
              <img
                src={gem.images[0]}
              
                width={100}
                height={100}
                className="rounded-full mx-auto mb-2"
              />
              <p className="font-semibold">{gem.productName}</p>
            </div>
          ))}
        </div>

        {/* Shop By Category */}
        <h2 className="text-2xl font-bold mb-4">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {products.slice(0,8).map((item,index) => (
            <div onClick={()=>navigate('/products')} key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer text-center">
              <img
                src={item.images[0]}
                width={100}
                height={100}
                className="mx-auto mb-2"
              />
              <p className="font-semibold">{item.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#374151] text-white p-8 mt-8">
        <div className="container mx-auto text-center">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt="Footer Ring"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h3 className="text-xl font-bold mb-2">OUR STORE</h3>
          <p className="mb-4 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Button 
            variant="outlined" 
            className="text-white border-white hover:text-yellow-400 hover:border-yellow-400"
          >
            CONTACT US
          </Button>
        </div>
      </footer>
      </motion.div>
  );
}

export default Home
