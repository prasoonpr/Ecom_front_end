/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import {
  useAddAddressMutation,
  useAddCartMutation,
  useApplyCouponMutation,
  useEditAddressMutation,
  useFailureOrderMutation,
  useGetAddressesQuery,
  useGetCartItemsQuery,
  usePlaceOrderMutation,
  useRemoveCartMutation,
  useVerifyPaymentMutation,
} from "../../services/userApi";
import { useEffect, useState } from "react";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import { Check } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteModal from "../../components/DeleteModal";
import { useNavigate } from "react-router-dom";
import OrderSuccessModal from "../../components/userComponents/modals/OrderSuccessModal";
import { validateAddressform } from "../../utils/user/FormValidation";
import { clearProtected } from "../../redux/protectedSlice/protectedCheckout";
import CouponModal from "../../components/userComponents/modals/CouponModal";
const test_key= import.meta.env.VITE_RAZORPAY_KEY_ID

const CheckOutPage = () => {
  
  const dispatch=useDispatch()
  const [failureOrder]=useFailureOrderMutation()
  const [addAddress]=useAddAddressMutation()
  const [applyCoupon]=useApplyCouponMutation()
  const [verifyPayment]=useVerifyPaymentMutation()
  const [placeOrder,{error}] = usePlaceOrderMutation();
  const navigate = useNavigate();
  const [editAddress] = useEditAddressMutation();
  const [addCart] = useAddCartMutation();
  const { data } = useGetAddressesQuery();
  const { data: cart } = useGetCartItemsQuery();
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(true);
  const [third, setThird] = useState(false);
  const [fourth, setFourth] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const userData = useSelector((state) => state.user.userProfile);
  const [removeCart] = useRemoveCartMutation();
  const [deleteOpen, setDeleteOpen] = useState(null);
  const [cartSave, setCartSave] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [err, setErr] = useState(false);
  const [outOfStock,setOutOfStock]=useState(false)
  const [viewCoupon,setViewcoupon]=useState(false)
  const [couponCode,setCouponCode]=useState('')
  const [couponDiscount,setCouponDiscount]=useState(null)
  const [paymentMethod,setPaymentMethod]=useState(null)
  const [isSuccess,setSuccess]=useState(false)
  const [edit,setEdit]=useState(false)


  useEffect(() => {
    if (data?.addresses) {
      setAddresses(data.addresses);
    }
    if (cart) {
      setCartItems([...cart.cartItemsWithOffer]);
      const isAnyOutOfStock=cart.cartItemsWithOffer.some(cartItem=>cartItem.productDetails.stock < cartItem.items.quantity)
      setOutOfStock(isAnyOutOfStock)

    }
  }, [data, cart]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternativePhone: "",
    addressType: "home",
  });

  //for handling form changes
  const handleForm = async (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //handle edit click
  const handleEdit = async (id) => {
    const address = addresses.find((address) => address._id === id);
    setForm(address);
    setEdit(true)
    setFormOpen(true);
  };

  //handle form close
  const handleFormClose = async () => {
    setForm({
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      alternativePhone: "",
      addressType: "",
    });
    setEdit(false)
    setFormOpen(false);
    setErr(false);
  };

  //for edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validate = validateAddressform(form);
    if (validate === false) {
      return setErr(true);
    } else {
      setErr(false);
    }
    const response = await editAddress(form);
    if (response.data) {
      handleFormClose();
    }
  };

    //for form submit
    const handleSubmit=async(e)=>{
      e.preventDefault()
      const validate= validateAddressform(form)
      if(validate===false){
        return setErr(true)
      }else{
        setErr(false)
      }
      const response=await addAddress(form)
      if(response.data){
        handleFormClose()
        toast.success(response.data.message)
      }
    }

  //handle quantity
  const handleQuantity = async (
    action,
    product_id,
    quantity,
    productPrice,
    stock
  ) => {
    let newQuantity = quantity;
    if (action === "add" && quantity < stock&&quantity<4) {
      newQuantity = quantity + 1;
    } else if (action === "reduce" && quantity > 1) {
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
  const handleRemove = async (product_id) => {
    const response = await removeCart({ product_id: product_id });
    if (response.data) {
      toast.success(response.data.message);
      setDeleteOpen(null);
    }
  };

  //handle delete click
  const handleDelete = async (id) => {
    setDeleteOpen(id);
  };

  // for closing the delete modal
  const handleDeleteClose = () => {
    setDeleteOpen(null);
  };

  //for save cart orders
  const handleCartSave = () => {
    const newCartSave = cartItems.map((cartItem) => ({
      address_id: selectedAddress,
      product_id: cartItem.productDetails._id,
      quantity: cartItem.items.quantity,
      price: cartItem.items.price,
    }));
    setCartSave(newCartSave);
    setThird(false);
    setFourth(true);
  };
  
  //for place order
  const handleOrder = async () => {
    const totalAmount=cart?.totalAmount - ((couponDiscount / 100) * cart?.totalAmount)
    if (paymentMethod === 'cashOnDeliver') {
      const response = await placeOrder({ cartSave, paymentMethod, totalPrice: totalAmount,couponDiscount,  });
      if (response.data) {
        setThird(false);
        setFourth(false);
        setSuccess(true)
        setTimeout(() => {
          dispatch(clearProtected());
        }, 5000);
      }else if(error){
        toast.error(error.data.message)
      }
    } else if (paymentMethod === 'razorpay') {
      try {
           const response = await placeOrder({cartSave,paymentMethod,totalPrice: totalAmount,couponDiscount});
           if (response.data) {
            const { id: order_id, amount, currency } = response.data.order;
            
            //for load the Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
    
            script.onload = () => {
              const options = {
                key: test_key, 
                amount,
                currency,
                name: 'Gemas DeLujo',
                description: 'Order Payment',
                order_id,
                handler: async function (response) {
                  const verifyResponse = await verifyPayment( {
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    cartSave,couponDiscount,paymentMethod
                  });
    
                  if (verifyResponse.data.success) {
                    setThird(false);
                    setFourth(false);
                    setSuccess(true)
                    setTimeout(() => {
                      dispatch(clearProtected());
                    }, 5000);
                  } else {
                    // alert('Payment verification failed');
                    console.log('ivde cheythalum mathi');
                    
                  }
                },
                prefill: {
                  name: 'Gemas DeLujo',
                  email: 'workpupose321654@gmail.com',
                  contact: '9778582849',
                },
                theme: {
                  color: '#3399cc',
                },
              };
              const rzp = new window.Razorpay(options);
              rzp.open();
              rzp.on('payment.failed', function (response) {
                console.log('Payment failed:', response);
                handlePendingOrder(cartSave, couponDiscount); 
              });
            };
          }else if(error){
            toast.error(error.data.message)
          }
      } catch (error) {
        console.log(error);
      }
    }
  };


  //for handle the failure of the payment
  const handlePendingOrder = async (cartSave, couponDiscount) => {
    const totalAmount=cart?.totalAmount - ((couponDiscount / 100) * cart?.totalAmount)
    try {
      const response = await failureOrder({
        cartSave,
        paymentMethod: 'razorpay',
        totalPrice: totalAmount,
        couponDiscount,
        paymentStatus: 'Pending',
      });
  
      if (response.data) {
        alert('Order placed successfully with payment pending.');
        const razorpayModal = document.querySelector('.razorpay-container');
        if (razorpayModal) {
          razorpayModal.remove();
        } else {
          console.warn('Razorpay modal not found!');
        }
        setThird(false);
        setFourth(false);
        setSuccess(true);
        setTimeout(() => {
          dispatch(clearProtected());
        }, 5000);
      } else {
        alert('Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }
  };
  

  //handle view coupon modal view
  const handleViewCoupon=()=>{
    setViewcoupon(!viewCoupon)
  }

  //for handle the apply coupon
  const handleApplyCoupon=async(totalAmount)=>{
    const response=await applyCoupon({couponCode,totalAmount})
    if(response.data){
      toast.success(response.data.message)
      setCouponDiscount(response.data.coupon.offer)
    }else if(response.error){
      toast.error(response.error.data.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#E5E7EB]"
    >
      {isSuccess && <OrderSuccessModal />}
      <div className="flex py-5  px-32">
        <div className="flex flex-col  h-auto w-4/5 ">
          {/* first seccection */}
          {first ? (
            <div className=" shadow-md flex flex-col rounded-sm   mb-5">
              <div className="flex bg-navbarColor w-full h-12 ">
                <LooksOneIcon
                  sx={{ color: "white", paddingTop: "2px", marginY: "auto" }}
                />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 my-auto text-white">
                  LOGIN
                </h1>
              </div>
              <div className="flex flex-col  h-auto w-full bg-white px-5">
                <span className="p-2 text-sm">
                  name: {userData?.firstName} {userData?.lastName}
                </span>
                <span className="p-2 text-sm">email: {userData?.email}</span>
                <button className="text-blue-500 text-start px-2 text-sm font-semibold">
                  Logout and sign in to another account
                </button>
                <button
                  onClick={() => {
                    setFirst(false), setSecond(true);
                  }}
                  className="text-white bg-yellow-500 w-44 h-12 shadow-lg rounded-sm text-center m-2  text-sm font-semibold"
                >
                  CONTINUE CHECKOUT
                </button>
                <p className="p-2 text-sm text-gray-400">
                  Please note that upon clicking "Logout" you will lose all
                  items in cart and will be redirected to GemasDeLujo home page
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md flex justify-between rounded-sm h-16 p-2 mb-5">
              <div className="flex">
                <LooksOneIcon sx={{ color: "#374151" }} />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 text-gray-500">
                  LOGIN
                </h1>{" "}
                <Check sx={{ color: "gray" }} />
              </div>
              <div className=" my-auto">
                <button
                  onClick={() => {
                    setFirst(true),
                      setSecond(false),
                      setThird(false),
                      setFourth(false);
                  }}
                  className="text-sm text-navbarColor font-semibold border-2 px-3 rounded-lg h-8"
                >
                  change
                </button>
              </div>
            </div>
          )}

          {/* second seccection */}
          {second ? (
            <div className=" shadow-md flex flex-col rounded-sm   mb-5">
              <div className="flex bg-navbarColor w-full h-12 ">
                <LooksTwoIcon
                  sx={{ color: "white", paddingTop: "2px", marginY: "auto" }}
                />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 my-auto text-white">
                  DELIVERY ADDRESS
                </h1>
              </div>
              <div className="bg-white px-5">
              {formOpen ?(
                <form
                  onSubmit={edit?handleEditSubmit:handleSubmit}
                  className="border bg-blue-50 rounded-sm p-6 my-6 "
                >
                  <h1 className="font-semibold text-sm text-blue-500">
                  {edit?"EDIT ADDRESS":"ADD A NEW ADDRESS"}
                  </h1>
                  <div className="flex justify-start gap-4 my-4 w-[600px] ">
                    <input
                      onChange={handleForm}
                      type="text"
                      name="name"
                      value={form.name}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow  h-12  placeholder:text-sm"
                      placeholder="*Name"
                    />
                    <input
                      onChange={handleForm}
                      type="text"
                      name="phone"
                      value={form.phone}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "
                      placeholder="*Phone"
                    />
                  </div>
                  <div className="flex justify-start gap-4 my-4 w-[600px]">
                    <input
                      onChange={handleForm}
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "
                      placeholder="*Pincode"
                    />
                    <input
                      onChange={handleForm}
                      type="text"
                      name="locality"
                      value={form.locality}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "
                      placeholder="*Locality"
                    />
                  </div>
                  <input
                    onChange={handleForm}
                    type="text"
                    name="address"
                    value={form.address}
                    className="p-3 border-2 focus:outline-none focus:border-blue-500 h-24 placeholder:text-sm w-[600px]"
                    placeholder="*Address(area and street)"
                  />
                  <div className="flex justify-start gap-4 my-4 w-[600px] ">
                    <input
                      onChange={handleForm}
                      type="text"
                      name="city"
                      value={form.city}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow  h-12 placeholder:text-sm "
                      placeholder="*City/District/Town"
                    />
                    <input
                      onChange={handleForm}
                      type="text"
                      name="state"
                      value={form.state}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "
                      placeholder="*State"
                    />
                  </div>
                  <div className="flex justify-start gap-4 my-4 w-[600px]">
                    <input
                      onChange={handleForm}
                      type="text"
                      name="landmark"
                      value={form.landmark}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "
                      placeholder="LandMark(optional)"
                    />
                    <input
                      onChange={handleForm}
                      type="text"
                      name="alternativePhone"
                      value={form.alternativePhone}
                      className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "
                      placeholder="Alternative Phone(optional)"
                    />
                  </div>
                  <p className="text-sm text-gray-500 ml-4">Address Type</p>
                  <div className="flex ml-3 mt-3">
                    <label className="flex items-center mr-4">
                      <input
                        type="radio"
                        name="addressType"
                        value="home"
                        checked={form.addressType === "home"}
                        onChange={handleForm}
                        className="form-radio text-blue-500"
                      />
                      <span className="ml-2">Home</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="addressType"
                        value="work"
                        checked={form.addressType === "work"}
                        onChange={handleForm}
                        className="form-radio text-blue-500"
                      />
                      <span className="ml-2">Work</span>
                    </label>
                  </div>
                  {err && (
                    <p className="text-sm text-red-500">
                      please fill the required fields
                    </p>
                  )}
                  <button
                    type="submit"
                    className="h-12 w-56 mt-3 shadow-lg rounded-sm text-white text-sm font-semibold  bg-blue-500"
                  >
                    SAVE
                  </button>
                  <button
                    className=" mt-3 ml-6 text-blue-500 text-sm font-semibold  "
                    onClick={handleFormClose}
                  >
                    CANCEL
                  </button>
                </form>
              ):(
                <button onClick={()=>{setFormOpen(true)}} className="w-full h-14 bg-white  border-2 text-start font-semibold text-sm text-blue-500  my-1 px-5 ">+ ADD A NEW ADDRESS</button>
              )}
  
               </div>
              <div className="flex flex-col  h-auto w-full bg-white px-5">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="h-32 p-4 w-full mb-1  border-2 flex justify-between"
                  >
                    <div className=" text-sm font-semibold flex gap-2">

                   
                    <div>
                      <input
                        value={address._id}
                        checked={selectedAddress?selectedAddress == address._id:address.defaultAddress}
                        className="cursor-pointer"
                        onChange={(e) => {
                          setSelectedAddress(e.target.value);
                        }}
                        type="radio"
                      />
                    </div>
                    <div className="flex flex-col">
                      {address.name},<br />
                      {address.phone},{address.pincode},{address.locality},
                      <br />
                      {address.address},{address.city},{address.state},
                      {address.landmark},<br />
                      <br />
                      Address Type:-{address.addressType}
                    </div>
                    </div>
                    <div className="">
                        <button className="text-sm bg-navbarColor text-white h-6 w-12 shadow-sm rounded-sm" onClick={() => handleEdit(address._id)}>
                            Edit
                        </button>
                    </div>
                  </div>
                ))}
                <button
                  disabled={selectedAddress == null}
                  onClick={() => {
                    setSecond(false), setThird(true);
                  }}
                  className="text-white bg-yellow-500 w-1/3 h-12 shadow-lg rounded-sm text-center m-2  text-sm font-semibold"
                >
                  SAVE ADDRESS AND CONTINUE
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md flex justify-between rounded-sm h-16 p-2 mb-5">
              <div className="flex">
                <LooksTwoIcon sx={{ color: "#374151" }} />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 text-gray-500">
                  DELIVERY ADDRESS
                </h1>{" "}
                {selectedAddress && <Check sx={{ color: "gray" }} />}
              </div>
              <div className=" my-auto">
                <button
                  onClick={() => {
                    setFirst(false),
                      setSecond(true),
                      setThird(false),
                      setFourth(false);
                  }}
                  className="text-sm text-navbarColor font-semibold border-2 px-3 rounded-lg h-8"
                >
                  change
                </button>
              </div>
            </div>
          )}


          {/* third seccection */}
          {third ? (
            <div className=" shadow-md flex flex-col rounded-sm mb-5 ">
              <div className="flex bg-navbarColor w-full h-12 ">
                <Looks3Icon
                  sx={{ color: "white", paddingTop: "2px", marginY: "auto" }}
                />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 my-auto text-white">
                  ORDER SUMMARY
                </h1>
              </div>
              {cartItems.length <= 0 ? (
                <div className=" sticky bottom-0 bg-white shadow-md  flex justify-between rounded-sm h-20 p-2 ">
                  <div>
                    <h1 className="text-sm mt-7 ml-64">Your cart is empty</h1>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/products");
                    }}
                    className="text-sm text-white bg-yellow-500 font-semibold border-2 px-16  my-auto rounded-lg h-14"
                  >
                    Continue Shoping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col  h-auto w-full bg-white px-5">
                  {cartItems.map((cartItem, index) => (
                    <div
                      key={index}
                      className=" relative bg-white flex rounded-sm border-b-2  p-2"
                    >
                      {cartItem.productDetails.stock <
                        cartItem.items.quantity && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center pointer-events-none">
                          <h1 className="text-red-600 font-bold text-lg">
                            Out of Stock
                          </h1>
                        </div>
                      )}
                      <div className="p-5">
                        <img
                          className="h-28 w-24 ml-2 rounded-sm"
                          src={cartItem?.productDetails?.images[0]}
                          alt=""
                        />
                        <div className="flex mt-5 ">
                          <button
                            onClick={() => {
                              handleQuantity(
                                "reduce",
                                cartItem.productDetails._id,
                                cartItem.items.quantity,
                                cartItem.productDetails.price
                              );
                            }}
                            className="h-8 w-8 rounded-full bg-gray-200"
                          >
                            -
                          </button>
                          <span className="h-8 w-8 mx-2 flex items-center justify-center border">
                            {cartItem?.items?.quantity}
                          </span>
                          <button
                            onClick={() => {
                              handleQuantity(
                                "add",
                                cartItem.productDetails._id,
                                cartItem.items.quantity,
                                cartItem.productDetails.price,
                                cartItem.productDetails.stock
                              );
                            }}
                            className="h-8 w-8 rounded-full bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-1 mt-5 justify-between">
                        <div className="ml-3">
                          <h1 className="font-medium mb-2">
                            {cartItem?.productDetails?.productName}
                          </h1>
                          <h1 className="text-xs font-medium text-gray-500 mb-2">
                            Category:{cartItem?.productDetails?.category},
                            Carat:{cartItem?.productDetails?.carat}
                          </h1>
                          <h1 className="font-medium text-sm mb-2 text-gray-500">
                            Origin:{cartItem?.productDetails?.origin}
                          </h1>
                          <h1 className="font-medium  mb-2 ">
                            {cartItem.offers.largestOffer.offerAmount!=cartItem.items.price&&<span className="font-medium text-sm line-through mb-2 text-gray-500">
                              ₹{cartItem?.items?.price}
                            </span>}
                            ₹{cartItem?.offers?.largestOffer?.offerAmount}
                            {cartItem.offers.largestOffer.offerAmount!=cartItem.items.price&&<span className="font-sans text-sm  mb-2 text-green-700 ml-2">
                            {cartItem?.offers?.largestOffer?.value}% off {cartItem?.offers?.allOffers?.length} offer available
                            </span>}
                          </h1>
                        </div>
                        <div className="flex flex-col justify-between">
                          <h1 className="mr-8 text-sm">
                            Deliver in two days, Sun{" "}
                            <span className="text-gray-400">|</span>{" "}
                            <span className="font-medium text-sm line-through mb-2 text-gray-500">
                              ₹40{" "}
                            </span>
                            <span className="text-green-700">Free</span>
                          </h1>
                          <button
                            onClick={() =>
                              handleDelete(cartItem.productDetails._id)
                            }
                            className="font-semibold text-balance mb-6 ml-4 text-gray-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                  disabled={outOfStock}
                    onClick={handleCartSave}
                    className={`text-white bg-yellow-500 w-44 h-12 ${outOfStock?'cursor-not-allowed':'cursor-pointer'} shadow-lg rounded-sm text-center m-2  text-sm font-semibold`}
                  >
                    CONTINUE CHECKOUT
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow-md flex justify-between rounded-sm h-16 p-2 mb-5">
              <div className="flex">
                <Looks3Icon sx={{ color: "#374151" }} />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 text-gray-500">
                  ORDER SUMMARY
                </h1>{" "}
                {cartSave.length > 0 && <Check sx={{ color: "gray" }} />}
              </div>
              <div className=" my-auto">
                {cartSave.length > 0 && (
                  <button
                    onClick={() => {
                      setFirst(false),
                        setSecond(false),
                        setThird(true),
                        setFourth(false);
                    }}
                    className="text-sm text-navbarColor font-semibold border-2 px-3 rounded-lg h-8"
                  >
                    change
                  </button>
                )}
              </div>
            </div>
          )}

          {/* fourth seccection */}
          {fourth ? (
            <div className=" shadow-md flex flex-col rounded-sm   mb-5">
              <div className="flex bg-navbarColor w-full h-12 ">
                <Looks4Icon
                  sx={{ color: "white", paddingTop: "2px", marginY: "auto" }}
                />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 my-auto text-white">
                  PAYMENT OPTIONS
                </h1>
              </div>
              <div className="flex flex-col  h-auto w-full bg-white px-5">
                <div className="flex gap-1 p-5">
                  <input
                    className="cursor-pointer"
                    onChange={(e)=>setPaymentMethod(e.target.value)}
                    checked={paymentMethod=='cashOnDeliver'}
                    type="radio"
                    value='cashOnDeliver'
                    name=""
                    id=""
                    disabled
                  />
                  <span className="text-sm text-gray-500 font-semibold">Cash On Deliver</span>
                </div>
                <div className="flex gap-1 p-5">
                  <input
                    className="cursor-pointer"
                    onChange={(e)=>setPaymentMethod(e.target.value)}
                    checked={paymentMethod=='razorpay'}
                    type="radio"
                    value='razorpay'
                    name=""
                    id=""
                  />
                  <span className="text-sm font-semibold">Razorpay</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="text-white bg-yellow-500 w-44 h-12 shadow-lg rounded-sm text-center m-2  text-sm font-semibold"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md flex justify-between rounded-sm h-16 p-2 mb-5">
              <div className="flex">
                <Looks4Icon sx={{ color: "#374151" }} />{" "}
                <h1 className="text-lg font-bold ml-2 mr-2 text-gray-500">
                  PAYMENT OPTIONS
                </h1>
              </div>
              <div className=" my-auto">
                {cartSave.length > 0 && (
                  <button
                    onClick={() => {
                      setFirst(false),
                        setSecond(false),
                        setThird(false),
                        setFourth(true);
                    }}
                    className="text-sm text-navbarColor font-semibold border-2 px-3 rounded-lg h-8"
                  >
                    change
                  </button>
                )}
              </div>
            </div>
          )}
          {fourth&& (
            <div className="bg-white shadow-md flex justify-between rounded-sm h-28 p-2 mb-5">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold ml-2 mr-2 text-gray-500">
                  Apply Coupon
                </h1>
                <div className="flex gap-2 items-center">
                <input onChange={(e)=>setCouponCode(e.target.value)} className="h-12 w-56 border-2 rounded-sm mt-2" type="text" />
                <button onClick={()=>handleApplyCoupon(cart?.totalAmount)} className="bg-yellow-500 text-white h-8 w-20 rounded-sm shadow-md">Apply</button>
                </div>
              </div>
              <div className=" my-auto">
              <button onClick={handleViewCoupon} className="text-sm text-navbarColor font-semibold border-2 px-3 rounded-lg h-8">View Coupon</button>
              </div>
            </div>
          )}
        </div>

        {/* right price tag */}
        <div className="bg-white shadow-md flex flex-col rounded-sm h-1/2 w-1/3 ml-5 px-5 sticky top-16">
          <div className="border-b-2  py-2">
            <h1 className="font-semibold text-lg  text-gray-500">
              PRICE DETAILS
            </h1>
          </div>
          <div className="flex flex-row justify-between py-5">
            <p className="">Price({cartItems.length} items)</p>
            <span>₹{cart?.totalAmount}</span>
          </div>
          <div className="flex flex-row justify-between py-5">
            <p className="">Discount {couponDiscount}%</p>
            <span className="text-green-700">{((couponDiscount / 100) * cart?.totalAmount)}</span>
          </div>
          <div className="flex flex-row justify-between py-5">
            <p className="">Delivery Charges</p>
            <span className="text-green-700">Free</span>
          </div>
          <div className="flex flex-row justify-between border-t border-b border-dashed border-gray-500 py-5">
            <p className="font-semibold text-lg">Total Amount</p>
            <span className="">{cart?.totalAmount - ((couponDiscount / 100) * cart?.totalAmount)}</span>
          </div>
          <div className="flex flex-row justify-center  py-5">
            <p className="font-semibold text-lg text-green-700">
              You will save ₹501 on this order
            </p>
          </div>
        </div>
      </div>
      {/* fake footer */}
      <div className="h-24 px-28 py-10 border-t-2 border-gray-300 flex justify-between">
        <div>
          <span className="text-sm text-gray-500 ">
            Policies: Retruns Policy | Terms of use | Security | Privacy{" "}
            <span className="ml-5 text-sm text-gray-600">
              © 20024-2025 GemasDeLujo.com
            </span>
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">
            Need help?Visit the{" "}
            <span className="text-sm text-blue-500">Help Center</span> or{" "}
            <span className="text-sm text-blue-500">Contact Us</span>
          </span>
        </div>
      </div>

      {deleteOpen && (
        <DeleteModal
          onClose={handleDeleteClose}
          onConfirm={handleRemove}
          id={deleteOpen}
        />
      )}
      {viewCoupon&&<CouponModal onClick={handleViewCoupon}/>}
    </motion.div>
  );
};

export default CheckOutPage;
