import { motion } from 'framer-motion';
import { Button, IconButton,  Rating, } from "@mui/material";
import { Add, Remove, FavoriteBorder, Favorite} from "@mui/icons-material";
// import { Button, IconButton, Paper, Rating, Slide, TextField } from "@mui/material";
// import { Add, Remove, FavoriteBorder, Favorite ,Send as SendIcon, Close as CloseIcon, Message as MessageIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAddCartMutation, useAddWishlistMutation, useGetProductDetailsQuery } from "../../services/userApi";
import { useEffect, useState } from "react";
import BreadCrumbs from '../BreadCrumbs';
import ReactImageMagnify from 'react-image-magnify';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
  const navigate=useNavigate()
  const [addWishlist]=useAddWishlistMutation()
  const [addCart]=useAddCartMutation()
  const [maximumQuantity]=useState(4)
  const { product_id } = useParams();
  const {user_id}=useSelector(state=>state?.user?.userProfile || {})
  const [userId,setUserId]=useState(null)
  const { data } = useGetProductDetailsQuery({ product_id: product_id,userId:userId });
  const [offers,setOffers]=useState({})
  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [quantity,setQuantity]=useState(1)
  const [isCart,setIsCart]=useState(false)
  const [isWishlist,SetIsWishlist]=useState(false)
  const [currenImageIndex,setCurrentImageIndex]=useState(0)
  // const [isChatOpen, setIsChatOpen] = useState(false);
  // const [message, setMessage] = useState('');
  // const [chatMessages, setChatMessages] = useState([]);
  
  useEffect(() => {
    if(user_id){
      setUserId(user_id)
    }
    if (data && data.product) {
      setProduct({ ...data.product });
        const totalStars = data?.product?.review?.reduce(
          (acc, obj) => acc + obj.star,
          0
        );
        const avgStar = Math.round(totalStars / data.product.review.length);
        setRating(avgStar);
    }
    if(data?.isCart){
      setIsCart(data.isCart)
    }
    if(data?.isWishlist){
      SetIsWishlist(data.isWishlist)
    }
    if(data?.offers){
      setOffers({...data.offers})
    }
  }, [data,user_id]);

  //for handling the next image
  const handleNextImage=()=>{
    if(product?.images?.length>0){
      setCurrentImageIndex((prevIndex)=>(prevIndex+1)%product.images.length)
    }
  }

  //for changing quantity
  const handleQuantity=(item)=>{
    if(item=='add'){
      setQuantity(quantity+1)
    }else{
      setQuantity(quantity-1)
    }
  }

  //for handling previous image
  const handlePrevImage=()=>{
    if(product?.images?.length>0){
      setCurrentImageIndex((prevIndex)=>(prevIndex-1+product.images.length)%product.images.length)
    }
  }

  //for handling add to cart
  const handleAddCart=async()=>{
    const items={
      product_id,
      quantity,
      price:product.price*quantity,
    }
    const response=await addCart(items)
    if(response.data){
      toast.success(response.data.message)
    }
  }
 
  //for handling add to wishlist
  const handleAddWishlist=async()=>{
    const response=await addWishlist({product_id:product_id})
    if(response.data){
      toast.success(response.data.message)
    }
  }

  // const toggleChat = () => {
  //   setIsChatOpen(!isChatOpen);
  // };
  
  // const sendChatMessage = () => {
  //   if (message.trim()) {
  //     setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
  //     setMessage('');
  //     // Simulate admin response
  //     setTimeout(() => {
  //       setChatMessages(prev => [...prev, { text: "Thanks for your message. An admin will respond shortly.", sender: 'admin' }]);
  //     }, 1000);
  //   }
  // };
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    >
    <BreadCrumbs productName={product.productName}/>
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 mt-5 bg-white shadow-md rounded-lg" >
      <div className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center">
        <div className="relative w-full max-w-sm mx-auto"> 
          <div className=" relative w-96 h-96 mx-auto overflow-hidden  rounded-lg flex items-center justify-center">
         
            <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: 'Wristwatch by Ted Baker London',
                      isFluidWidth: true,
                      src:product.images?.[currenImageIndex]

                  },
                  largeImage: {
                    src:product.images?.[currenImageIndex],
                      width: 1800,
                      height: 1800
                  },
                  enlargedImageContainerDimensions: { width: '150%', height: '150%' },
                  enlargedImagePosition: 'beside',
                  enlargedImagePortalId:'portalId', 
                  }}
              />
          </div>
          <button
            onClick={handlePrevImage}
            className="absolute left-[-28px] top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-[-28px] top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md"
          >
            &gt;
          </button>
          <div className="flex justify-center mt-4">
            {product.images?.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currenImageIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        </div>

      </div>

      <div  className="md:w-1/2 md:pl-8">
      <div id='portalId'>
      {product.stock>0 ?( 
        <div className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded mb-2 inline-block">
          IN STOCK
        </div>):( 
          <div className="bg-red-500 text-white text-xs font-bold py-1 px-3 rounded mb-2 inline-block">
          OUT OF STOCK
        </div>)
      }
      <p className="inline-block text-xs text-gray-500 ml-3">{product.stock} left</p>
      </div>
       
        <h1 className="text-2xl font-semibold mb-2">{product.productName}</h1>

        <div className="flex items-center mb-3">
          <Rating value={rating} readOnly size="small" />
          <span className="text-sm text-gray-600 ml-2">
            {product?.review?.length} Customer Reviews
          </span>
        </div>
        <div className='flex items-center'>
        {offers?.largestOffer?.value>0&&(<p className="text-xl font-semibold text-gray-500 mb-4 line-through mr-2">
          ₹{product.price*quantity}
        </p>)}
        <p className="text-3xl font-bold text-gray-900 mb-4">
          ₹{product.price*quantity-((product.price*quantity)/100)*offers?.largestOffer?.value}
        </p>
        {offers?.largestOffer?.value>0&&(<p className='font-medium text-sm  mb-2 text-green-700  ml-2'>
        {offers?.largestOffer?.value}% off {offers?.allOffers?.length} offer available!
        </p>)}
        </div>

        <p className="text-sm text-gray-700 mb-6">{product.description}</p>

        <div className="flex items-center mb-5">
          <span className="mr-4 text-gray-700">Quantity</span>
          <IconButton disabled={quantity==1} onClick={()=>handleQuantity('reduce')} size="small" className="border border-gray-300">
            <Remove fontSize="small" />
          </IconButton>
          <span className="mx-4 text-gray-700">{quantity}</span>
          <IconButton onClick={()=>handleQuantity('add')} size="small" disabled={quantity==product.stock||product.stock==0||quantity>=maximumQuantity} className="border border-gray-300">
            <Add fontSize="small" />
          </IconButton>
        </div>

        <div className="flex mb-4 gap-2 justify-start">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f97316",
              "&:hover": { backgroundColor: "#ea580c" },
              color: "white",
              width: "100px",
            }}
          >
            BUY
          </Button>
          {isCart?(
            <Button
            variant="contained"
            sx={{
              backgroundColor: "#6b7280",
              "&:hover": { backgroundColor: "#4b5563" },
              color: "white",
              width: "150px",
            }}
            onClick={()=>{navigate('/view-cart')}}
          >
           GO TO CART
          </Button>
          ):(
            <Button
            variant="contained"
            sx={{
              backgroundColor: "#f59e0b",
              "&:hover": { backgroundColor: "#d97706" },
              color: "white",
              width: "150px",
            }}
            onClick={handleAddCart}
          >
            ADD TO CART
          </Button>
          )}
        </div>

          {isWishlist?(
                <Button
                startIcon={<Favorite style={{fill:'red'}}/>}
                variant="outlined"
                sx={{
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  "&:hover": { backgroundColor: "#fef2f2" },
                  width: "40%",
                }}
                onClick={()=>navigate('/account/wishlist')}
              >
                GO TO WISHLIST
              </Button>
          ):(
            <Button
            startIcon={<FavoriteBorder />}
            variant="outlined"
            sx={{
              borderColor: "#ef4444",
              color: "#ef4444",
              "&:hover": { backgroundColor: "#fef2f2" },
              width: "40%",
            }}
            onClick={handleAddWishlist}
          >
            ADD TO WISHLIST
          </Button>
          )}
        

        <div className="mt-6 text-sm text-gray-600">
          <p>
            <strong>ORIGIN:</strong> {product.origin}
          </p>
          <p>
            <strong>CARAT:</strong>
            {product.carat}
          </p>
        </div>
      {/* <div>
      if you want the stone in anything the message to admin
      <Button
            variant="contained"
            startIcon={<MessageIcon />}
            onClick={toggleChat}
            className="mt-8 bg-white text-indigo-600 hover:bg-indigo-100 py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
            Message Admin
          </Button>
      </div> */}
      </div>
      </div>
      {/* <Slide direction="up" in={isChatOpen} mountOnEnter unmountOnExit>
        <Paper elevation={4} className="fixed bottom-5 right-8 w-96 h-3/4 rounded-t-lg overflow-hidden flex flex-col">
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-bold">Chat with Admin</h3>
            <IconButton onClick={toggleChat} size="small" className="text-white">
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
            {chatMessages.map((msg, index) => (
              <div 
              key={index} 
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-indigo-200 ml-auto' : 'bg-white'
              } max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-4 bg-white flex">
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size="small"
              />
            <IconButton onClick={sendChatMessage} color="primary">
              <SendIcon />
            </IconButton>
          </div>
        </Paper>
      </Slide> */}
      </motion.div>
  );
};

export default ProductDetails;
