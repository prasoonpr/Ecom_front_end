// import { motion } from "framer-motion";
// import { Trash } from "lucide-react";
// import { useGetWishlistQuery, useRemoveWishlistMutation } from "../../services/userApi";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DeleteModal from "../DeleteModal";
// import { toast } from "sonner";
// // import { useState } from "react";

// const Wishlist = () => {
//     const navigate=useNavigate()
//     const [removeWishlist]=useRemoveWishlistMutation()
//     const {data}=useGetWishlistQuery()
//     const [wishlist,setWishlist]=useState([])
//     const [deleteOpen,setDeleteOpen]=useState(null)


//   useEffect(()=>{
//     if(data?.wishlist){
//         setWishlist([...data.wishlist])
//     }
//   },[data])
//   console.log(wishlist);
  
//   //for handle wishlist item click
//   const handleWishlist=(id)=>{
//     navigate(`/products/product-details/${id}`)
//   }

// //handle delete click
// const handleDelete=async(id)=>{
//   setDeleteOpen(id)
// }

// // for closing the delete modal
// const handleDeleteClose=()=>{
//   setDeleteOpen(null)
// }
//   //for removing product from wishlist
//   const handleRemove=async(product_id)=>{
//     const response=await removeWishlist({product_id:product_id})
//     if(response.data){
//       toast.success(response.data.message)
//       setDeleteOpen(null)
//     }
    
//   }
//   return (
//     <div className="h-auto w-full bg-white shadow-md  rounded-sm ml-6">
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="flex flex-col  "
//     >
//       <h1 className="border-b-2 p-6">My Wishlist ({wishlist.length} items)</h1>

//     {wishlist.map((items,index)=>(
//       <div key={index} className=" relative  flex border-b-2  p-2">
//         <div  onClick={()=>handleWishlist(items.productDetails._id)} className="p-5 cursor-pointer">
//           <img className="h-28 w-24 ml-2 rounded-sm" src={items.productDetails.images[0]} alt="" />
//         </div>
//         <div className="flex flex-1 mt-5 justify-between">
//           <div onClick={()=>handleWishlist(items.productDetails._id)} className="ml-3 cursor-pointer">
//             <h1 className="font-medium mb-2">{items.productDetails.productName}</h1>
//             <h1 className="text-xs font-medium text-gray-500 mb-2">
//               Category:{items.productDetails.category}, Carat:{items.productDetails.carat}
//             </h1>
//             <h1 className="font-medium text-sm mb-2 text-gray-500">
//               Origin:{items.productDetails.origin}
//             </h1>
//             <h1 className="font-medium  mb-2 ">
//               <span className="font-medium text-sm line-through mb-2 text-gray-500">
//                 ₹{items.productDetails.price}
//               </span>{" "}
//               ₹{items.productDetails.price-100}{" "}
//               <span className="font-sans text-sm  mb-2 text-green-700 ml-2">
//                 10% off 
//               </span>
//             </h1>
//           </div>
//           <div className="flex flex-col ">
//             {/* <h1 className='mr-8 text-sm'>Deliver in two days, Sun <span className='text-gray-400'>|</span> <span className='font-medium text-sm line-through mb-2 text-gray-500'>₹40 </span><span className='text-green-700'>Free</span></h1> */}
//             <button onClick={()=>handleDelete(items.productDetails._id)} className="mr-4">
//               <Trash className="text-gray-500 size-5" />
//             </button>
//           </div>
//         </div>
//       </div>

//     ))}
// {deleteOpen&&<DeleteModal onClose={handleDeleteClose} onConfirm={handleRemove} id={deleteOpen}/>}

//     </motion.div>
//     </div>
//   );
// };

// export default Wishlist;




import { motion } from "framer-motion";
import { Trash } from 'lucide-react';
import { useGetWishlistQuery, useRemoveWishlistMutation } from "../../services/userApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal";
import { toast } from "sonner";

const Wishlist = () => {
    const navigate = useNavigate()
    const [removeWishlist] = useRemoveWishlistMutation()
    const { data } = useGetWishlistQuery()
    const [wishlist, setWishlist] = useState([])
    const [deleteOpen, setDeleteOpen] = useState(null)

    useEffect(() => {
        if (data?.wishlist) {
            setWishlist([...data.wishlist])
        }
    }, [data])

    const handleWishlist = (id) => {
        navigate(`/products/product-details/${id}`)
    }

    const handleDelete = async (id) => {
        setDeleteOpen(id)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(null)
    }

    const handleRemove = async (product_id) => {
        const response = await removeWishlist({ product_id: product_id })
        if (response.data) {
            toast.success(response.data.message)
            setDeleteOpen(null)
        }
    }

    return (
        <div className="h-auto w-full bg-white shadow-md rounded-sm md:ml-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
            >
                <h1 className="border-b-2 p-4 md:p-6 text-lg md:text-xl font-semibold">My Wishlist ({wishlist.length} items)</h1>

                {wishlist.map((items, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row border-b-2 p-2 md:p-4">
                         {!items.productDetails.status && (
                    <div className='absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center pointer-events-none'>
                        <h1 className='text-red-600 font-bold text-lg'>Blocked Product!</h1>
                    </div>
                  )}
                        <div onClick={() => handleWishlist(items.productDetails._id)} className="p-2 md:p-5 cursor-pointer">
                            <img className="h-24 w-20 md:h-28 md:w-24 mx-auto md:ml-2 rounded-sm" src={items.productDetails.images[0]} alt="" />
                        </div>
                        <div className="flex flex-1 flex-col md:flex-row mt-2 md:mt-5 justify-between">
                            <div onClick={() => handleWishlist(items.productDetails._id)} className="md:ml-3 cursor-pointer">
                                <h1 className="font-medium mb-1 md:mb-2 text-sm md:text-base">{items.productDetails.productName}</h1>
                                <h1 className="text-xs font-medium text-gray-500 mb-1 md:mb-2">
                                    Category: {items.productDetails.category}, Carat: {items.productDetails.carat}
                                </h1>
                                <h1 className="font-medium text-xs md:text-sm mb-1 md:mb-2 text-gray-500">
                                    Origin: {items.productDetails.origin}
                                </h1>
                                <h1 className="font-medium mb-2 text-sm md:text-base">
                                    <span className="font-medium text-xs md:text-sm line-through mb-1 md:mb-2 text-gray-500">
                                        ₹{items.productDetails.price}
                                    </span>{" "}
                                    ₹{items.productDetails.price - 100}{" "}
                                    <span className="font-sans text-xs md:text-sm mb-1 md:mb-2 text-green-700 ml-2">
                                        10% off
                                    </span>
                                </h1>
                            </div>
                            <div className="flex justify-end md:flex-col mt-2 md:mt-0">
                                <button onClick={() => handleDelete(items.productDetails._id)} className="mr-2 md:mr-4">
                                    <Trash className="text-gray-500 size-4 md:size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {deleteOpen && <DeleteModal onClose={handleDeleteClose} onConfirm={handleRemove} id={deleteOpen} />}
            </motion.div>
        </div>
    );
};

export default Wishlist;
