import { motion } from 'framer-motion';
import { useAddCartMutation, useGetAddressesQuery, useGetCartItemsQuery, useRemoveCartMutation } from '../../services/userApi';
import { useEffect, useState } from 'react';
import AddressModal from './modals/AddressModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DeleteModal from '../DeleteModal';
import { useDispatch } from 'react-redux';
import { setProtected } from '../../redux/protectedSlice/protectedCheckout';

const Cart = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [removeCart,{error}]=useRemoveCartMutation()
    const [addCart]=useAddCartMutation()
    const {data}=useGetAddressesQuery()
    const {data:cart}=useGetCartItemsQuery()
    const[addresses,setAddresses]=useState([])
    const [cartItems,setCartItems]=useState([])
    const [addressOpen,setAddressOpen]=useState(false)
    // const [addresIndex,setAddressIndex]=useState(0)
    const [address,setAddress]=useState([])
    const [deleteOpen,setDeleteOpen]=useState(null)
    const [outOfStock,setOutOfStock]=useState(false)
   
    useEffect(()=>{
        if(data?.addresses){
            setAddresses(data.addresses)
            const address=data.addresses.filter(address=>address.defaultAddress)
            console.log(address);
            
            setAddress(address)
        }
        if(cart){
            setCartItems([...cart.cartItemsWithOffer])
            const isAnyOutOfStock=cart.cartItemsWithOffer.some(cartItem=>cartItem.productDetails.stock < cartItem.items.quantity)
            const isAnyBlockedProduct=cart.cartItemsWithOffer.some(cartItem=>!cartItem.productDetails.status)
            setOutOfStock(isAnyOutOfStock)
            setOutOfStock(isAnyBlockedProduct)
        }
      },[data,cart])

// for handling close address
const closeAddress=()=>{
    setAddressOpen(false)
}
//handle quantity
const handleQuantity = async (action, product_id, quantity, productPrice,stock) => {
    let newQuantity = quantity;
    if (action === 'add'&&quantity<stock&&quantity<4) {
      newQuantity = quantity + 1;
    } else if (action === 'reduce' && quantity > 1) { 
      newQuantity = quantity - 1;
    }
    const updatedPrice = productPrice * newQuantity; 
    const item = {
      product_id,
      quantity: newQuantity,
      price: updatedPrice,
    };
    await addCart(item);
  };

//for removing cart item
const handleRemove=async(product_id)=>{
   const response= await removeCart({product_id:product_id})
   if(response.data){
    toast.success(response.data.message)
    setDeleteOpen(null)
   }else{
    toast.error(error.data.message)
   }
}
      
//handle delete click
const handleDelete=async(id)=>{
    setDeleteOpen(id)
  }
  
  
  // for closing the delete modal
  const handleDeleteClose=()=>{
    setDeleteOpen(null)
  }

  //handle place order
  const handlePlaceOrder=()=>{
      dispatch(setProtected(true))
      navigate('/check-out')
  }
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  className="min-h-screen bg-[#E5E7EB]"
  >
    <div className='flex py-5  px-32'>
        <div className='flex flex-col  h-auto w-4/5 '>
            <div className='bg-white shadow-md flex justify-between rounded-sm h-16 p-2 mb-5'>
                <div>
                    <p className='text-sm'>Delever to: <span className='text-sm font-semibold'>{address[0]?.name},{address[0]?.pincode}</span></p>
                    <p className='text-sm'><span className='text-sm font-medium text-gray-500'>{address[0]?.locality},{address[0]?.address},{address[0]?.city}</span></p>
                </div>
                <div className=' my-auto'>
                    <button onClick={()=>{setAddressOpen(true)}} className='text-sm text-blue-500 font-semibold border-2 px-3 rounded-lg h-8'>change</button>
                </div>
            </div>
            {cartItems.map((cartItem,index)=>(
            <div key={index} className=' relative bg-white flex rounded-sm border-b-2  p-2'>
                
                  {cartItem.productDetails.stock < cartItem.items.quantity && (
                    <div className='absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center pointer-events-none'>
                        <h1 className='text-red-600 font-bold text-lg'>Out of Stock</h1>
                    </div>
                  )}
                   {!cartItem.productDetails.status && (
                    <div className='absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center pointer-events-none'>
                        <h1 className='text-red-600 font-bold text-lg'>Blocked Product!</h1>
                    </div>
                  )}
                <div className='p-5'>
                    <img className='h-28 w-24 ml-2 rounded-sm' src={cartItem?.productDetails?.images[0]} alt="" />   
                    <div className='flex mt-5 '>
                        <button onClick={()=>{handleQuantity('reduce',cartItem.productDetails._id,cartItem.items.quantity,cartItem.productDetails.price)}} className="h-8 w-8 rounded-full bg-gray-200">-</button>
                        <span className="h-8 w-8 mx-2 flex items-center justify-center border">{cartItem?.items?.quantity}</span>
                        <button onClick={()=>{handleQuantity('add',cartItem.productDetails._id,cartItem.items.quantity,cartItem.productDetails.price,cartItem.productDetails.stock)}} className="h-8 w-8 rounded-full bg-gray-200">+</button>
                    </div>
                </div>
                <div className='flex flex-1 mt-5 justify-between'>
                    <div className='ml-3'>
                        <h1 className='font-medium mb-2'>{cartItem?.productDetails?.productName}</h1>
                        <h1 className='text-xs font-medium text-gray-500 mb-2'>Category:{cartItem?.productDetails?.category}, Carat:{cartItem?.productDetails?.carat}</h1>
                        <h1 className='font-medium text-sm mb-2 text-gray-500'>Origin:{cartItem?.productDetails?.origin}</h1>
                        <h1 className='font-medium  mb-2 '>{cartItem.offers.largestOffer.offerAmount!=cartItem.items.price&&<span className='font-medium text-sm line-through mb-2 text-gray-500'>₹{cartItem?.items?.price}</span>} ₹{cartItem?.offers?.largestOffer?.offerAmount} {cartItem.offers.largestOffer.offerAmount!=cartItem.items.price&&<span className='font-sans text-sm  mb-2 text-green-700 ml-2'>{cartItem?.offers?.largestOffer?.value}% off {cartItem?.offers?.allOffers?.length} offer available</span>}</h1>
                    </div>
                    <div className='flex flex-col justify-between'>
                        <h1 className='mr-8 text-sm'>Deliver in two days, Sun <span className='text-gray-400'>|</span> <span className='font-medium text-sm line-through mb-2 text-gray-500'>₹40 </span><span className='text-green-700'>Free</span></h1>
                       <button onClick={()=>handleDelete(cartItem.productDetails._id)} className='font-semibold text-balance mb-6 ml-4 text-gray-900'>Remove</button>
                    </div>
                </div>
            </div>
            ))}
            {cartItems.length<=0?(
                  <div className=' sticky bottom-0 bg-white shadow-md  flex justify-between rounded-sm h-20 p-2 '>
                  <div>
                    <h1 className='text-sm mt-7 ml-64'>Your cart is empty</h1>
                  </div>
                  <button onClick={()=>navigate('/products')} className='text-sm text-white bg-orange-500 font-semibold border-2 px-16  my-auto rounded-lg h-14'>Continue Shoping</button>
                  </div>
            ):(
                <div className=' sticky bottom-0 bg-white shadow-md  flex justify-between rounded-sm h-20 p-2 '
                style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)" }}
                >
                <div></div>
                <button disabled={outOfStock} onClick={handlePlaceOrder} className={`text-sm ${outOfStock?'cursor-not-allowed':'cursor-pointer'} text-white bg-orange-500 font-semibold border-2 px-16  my-auto rounded-lg h-14`}>Place Order</button>
                </div>
            )}
          
        </div>

        {/* right price tag */}
        <div  className='bg-white shadow-md flex flex-col rounded-sm h-1/2 w-1/3 ml-5 px-5 sticky top-16'>
            <div className='border-b-2  py-2'>
                <h1 className='font-semibold text-lg  text-gray-500'>PRICE DETAILS</h1>
            </div>
            <div className='flex flex-row justify-between py-5'>
                <p className=''>Price({cartItems.length} items)</p>
                <span>₹{cart?.totalAmount}</span>
            </div>
            <div className='flex flex-row justify-between py-5'>
                <p className=''>Discount</p>
                <span className='text-green-700'>0</span>
            </div>
            <div className='flex flex-row justify-between py-5'>
                <p className=''>Delivery Charges</p>
                <span className='text-green-700'>Free</span>
            </div>
            <div className='flex flex-row justify-between border-t border-b border-dashed border-gray-500 py-5'>
                <p className='font-semibold text-lg'>Total Amount</p>
                <span className=''>{cart?.totalAmount}</span>
            </div>
            <div className='flex flex-row justify-center  py-5'>
                <p className='font-semibold text-lg text-green-700'>You will save ₹501 on this order</p>
            </div>
        </div>
    </div>
{/* fake footer */}
<div className='h-24 px-28 py-10 border-t-2 border-gray-300 flex justify-between'>
<div >
        <span className='text-sm text-gray-500 '>Policies: Retruns Policy | Terms of use | Security | Privacy <span className='ml-5 text-sm text-gray-600'>© 20024-2025 GemasDeLujo.com</span></span>
</div>
<div>
<span  className='text-sm text-gray-500'>Need help?Visit the <span className='text-sm text-blue-500'>Help Center</span> or <span className='text-sm text-blue-500'>Contact Us</span></span>
</div>
</div>
{addressOpen&&<AddressModal onClose={closeAddress} addresses={addresses} />}
{deleteOpen&&<DeleteModal onClose={handleDeleteClose} onConfirm={handleRemove} id={deleteOpen}/>}

  </motion.div>
  )
}

export default Cart


