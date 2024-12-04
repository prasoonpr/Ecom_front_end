import { useEffect, useState } from "react";
import {
  useAddWalletMutation,
  useCancellOrderMutation,
  useGetOrdersQuery,
  useRetryPaymentMutation,
  useVerifyRetryMutation,
} from "../../services/userApi";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { toast } from "sonner";
import CancellModal from "./modals/CancellModal";
import jsPDF from "jspdf";
const test_key= import.meta.env.VITE_RAZORPAY_KEY_ID


const Orders = () => {
  const [verifyRetry]=useVerifyRetryMutation()
  const [retryPament,{error}]=useRetryPaymentMutation()
  const [cancellOrder] = useCancellOrderMutation();
  const [addWallet]=useAddWalletMutation()
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const { data } = useGetOrdersQuery({page: currentPage,limit: productsPerPage});
  const [orders, setOrders] = useState([]);
  const [details, setDetails] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [cancellationData, setCancellationData] = useState({ product_id: null, quantity: null, order_id: null,amount:null,productName:null ,payment_id:null});
    
  useEffect(() => {
    if (data?.orderItems) {
      setOrders([...data.orderItems]);
    }
  }, [data]);

  //handle cancell order
  const handleCancell = async (product_id, quantity, order_id,amount,productName,payment_id) => {
    setCancellationData({ product_id, quantity, order_id,amount,productName,payment_id });
    setConfirmation(!confirmation)
  };

  // cancell order after confirmation
  const onConfirmCancellation = async (product_id, quantity, order_id,amount,productName,payment_id) => {
    const response = await cancellOrder({
      product_id: product_id,
      quantity: quantity,
      order_id: order_id,
    });
    if (response.data) {
      await addWallet({amount:amount,productName:productName,order_id:order_id,payment_id})
      toast.success(response.data.message);
      setConfirmation(!confirmation)
    }
  };

  //for retry option 
  const handleRetry=async(amount,order_id)=>{
    try {
      const response=await retryPament({amount,order_id})
      if (response.data) {
        const { id: order_id, amount, currency } = response.data.order;
        const orderId=response.data.order_id
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
            //  handler: async function () {
              handler: async function (response) {
               const verifyResponse = await verifyRetry( {
                 payment_id: response.razorpay_payment_id,
                 razorpay_order_id: response.razorpay_order_id,
                 signature: response.razorpay_signature,
                 orderId
               });
  
               if (verifyResponse.data) {
                //  setThird(false);
                //  setFourth(false);
                //  setSuccess(true)
                //  setTimeout(() => {
                //    dispatch(clearProtected());
                //  }, 5000);
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
          //  rzp.on('payment.failed', function (response) {
          //    console.log('Payment failed:', response);
          //    handlePendingOrder(cartSave, couponDiscount); 
          //  });
         };
       }else if(error){
         toast.error(error.data.message)
       }
    } catch (error) {
      console.log(error);
      
    }
    }

    //for handling the invoice download option
    const handleDownload=(order)=>{
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text("Invoice", 105, 20, { align: "center" });
    
      // Order Details
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.items._id}`, 20, 40);
      doc.text(`Order Status: ${order.items.order_status}`, 20, 50);
      doc.text(`Order Date: ${new Date(order.items.itemCreatedAt).toLocaleString()}`, 20, 60);
    
      // Product Details
      doc.text("Product Details:", 20, 80);
      doc.text(`Product Name: ${order.productDetails.productName}`, 30, 90);
      doc.text(`Quantity: ${order.items.quantity}`, 30, 100);
      doc.text(`Price: Rs.${order.items.payableAmount}`, 30, 110);
    
      // Payment Details
      doc.text("Payment Details:", 20, 130);
      doc.text(`Payment Method: ${order.items.payment_method}`, 30, 140);
      doc.text(`Total Amount: Rs.${order.items.payableAmount}`, 30, 150);
      doc.text(`Payment Status: Rs.${order.items.payment_status}`, 30, 160);
    
      // Address Details
      doc.text("Shipping Address:", 20, 180);
      doc.text(`${order.addressDetails.address}`, 30, 190);
      doc.text(`City: ${order.addressDetails.city}`, 30, 200);
      doc.text(`Pincode: ${order.addressDetails.pincode}`, 30, 210);
      doc.text(`Phone: ${order.addressDetails.phone}`, 30, 220);
    
      // Save PDF
      doc.save(`invoice_${order.items._id}.pdf`);
    }
  

  return (
    <div className=" flex flex-col rounded-sm ml-6 w-full">
      {confirmation && <CancellModal onConfirm={onConfirmCancellation} onClose={handleCancell} cancellationData={cancellationData}/>}
      {orders.map((order, index) => (
        <div  key={index} className="rounded-sm mb-2 hover:shadow-2xl relative  bg-white p-2">
          {order.items.order_status === "Cancelled" && (
                    <div className='absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center '>
                        <h1 className='text-red-600 font-bold text-lg'>Cancelled !</h1>
                    </div>    
                  )}
        <div className="  flex">
          <div className="p-5">
            <img
              className="h-24 w-20 ml-2 rounded-sm"
              src={order?.productDetails?.images[0]}
              alt=""
            />
          </div>
          <div className="flex flex-1 mt-5 ">
            <div className="ml-3 w-1/3">
              <h1 className="font-medium mb-2">
                {order?.productDetails?.productName}
              </h1>
              <h1 className="text-xs font-medium text-gray-500 mb-2">
                Category:{order?.productDetails?.category}, Carat:
                {order?.productDetails?.carat}
              </h1>
              <h1 className="font-medium text-xs mb-2 text-gray-500">
                x{order.items.quantity}
              </h1>
            </div>
            <div className="w-1/3 text-center">
              <span className="text-sm font-medium">₹ {order.items.payableAmount}</span>
            </div>
            <div className="w-1/3 text-start">
              {order.items.order_status === "Pending" && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex ">
                    <Circle className="size-4 mr-1 fill-orange-500 " />{" "}
                    <h1 className=" text-sm">Pending... </h1>
                  </div>
                  {details!==String(order.items._id)?
                  <button
                    onClick={() => {
                      setDetails(order.items._id);
                    }}
                    className="text-end  text-sm text-blue-500 font-semibold"
                  >
                    View Details
                  </button>:''}
                  {/* <button onClick={()=>handleCancell(order.productDetails._id,order.items.quantity,order.items._id)} className="text-end  text-sm text-red-500 font-semibold">cancell order</button> */}
                </div>
              )}
              {order.items.order_status === "Cancelled" && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex ">
                    <Circle className="size-4 mr-1 fill-red-500 " />{" "}
                    <h1 className=" text-sm">Cancelled </h1>
                  </div>
                  {details!==String(order.items._id)?
                  <button
                    onClick={() => {
                      setDetails(order.items._id);
                    }}
                    className="text-end  text-sm text-blue-500 font-semibold"
                  >
                    View Details
                  </button>:''}
                </div>
              )}
              {order.items.order_status === "Shipped" && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex ">
                    <Circle className="size-4 mr-1 fill-yellow-500" />{" "}
                    <h1 className=" text-sm">
                      Item shipped <span className="text-gray-500">|</span>{" "}
                      Deliver in two days, Sun{" "}
                    </h1>
                  </div>
                  {details!==String(order.items._id)?
                  <button
                    onClick={() => {
                      setDetails(order.items._id);
                    }}
                    className="text-end  text-sm text-blue-500 font-semibold"
                  >
                    View Details
                  </button>:''}
                </div>
              )}
              {order.items.order_status === "Delivered" && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex flex-col ">
                    <div className="flex">
                      <Circle className="size-4 fill-green-500 mr-1" />{" "}
                      <h1 className=" text-sm font-semibold">
                        Delivered on Nov 7{" "}
                      </h1>
                    </div>
                    <p className="ml-1 mt-1 text-xs text-gray-500">
                      your item has been delivered
                    </p>
                    <p className='ml-1 mt-5 text-sm font-semibold text-blue-700'>Rate & Review Product</p>
                  </div>
                  {details!==String(order.items._id)?
                  <button
                    onClick={() => {
                      setDetails(order.items._id);
                    }}
                    className="text-end  text-sm text-blue-500 font-semibold"
                  >
                    View Details
                  </button>:''}
                </div>
              )}
            </div>
          </div>
         </div>   
         {details==String(order.items._id)?(
          <div className="flex flex-col">
            <div className=" pl-8 mt-5 flex justify-between">
              <div className="flex flex-col">
                  <span className="text-sm font-semibold mb-2">Delivery Address</span>
                  <span className="text-sm mb-1 font-mono">{order.addressDetails.name},{order.addressDetails.phone}</span>
                  <span className="text-sm mb-1 font-mono">{order.addressDetails.pincode},{order.addressDetails.address}</span>
                  <span className="text-sm mb-1 font-mono">{order.addressDetails.locality},{order.addressDetails.city}</span>
              </div>
              <div className="flex flex-col ml-5">
                  <span className="text-sm font-semibold mb-2">Order Details</span>
                  <span className="text-sm mb-1 font-mono">Order Id: <span className="text-sm text-gray-500">{order.items._id}</span> </span>
                  <span className="text-sm mb-1 font-mono">Payment Method: <span className="text-sm text-gray-500">{order.items.payment_method}</span></span>
                  <span className="text-sm mb-1 font-mono">payment status: <span className="text-sm text-gray-500">{order.items.payment_status}</span>{order.items.payment_method=='razorpay'&&order.items.payment_status=='Pending'&&<button onClick={()=>handleRetry(order.items.payableAmount,order.items._id)} className="text-red-500 text-sm font-semibold ml-2">- Retry</button>}</span>
              </div>
              <div className="flex flex-col-reverse ml-10 text-center">
                  <button onClick={()=>handleCancell(order.productDetails._id,order.items.quantity,order.items._id,order.items.payableAmount,order.productDetails.productName,order.items.payment_id)} className="text-end text-sm text-red-500 font-semibold">{order.items.order_status==='Delivered'?'Return':'Cancell Order'}</button>
                    {order.items.order_status==='Delivered'&&<span className="text-xs text-gray-500">only before 7 days</span>} 
              </div>
            </div>
            <div className="flex justify-between mt-5">
              <button onClick={()=>handleDownload(order)} className="bg-blue-400 py-1 px-2 rounded-sm shadow-sm ml-5 text-sm font-medium">Invoice Download</button>
              <div className="flex flex-col-reverse ">
                  <button onClick={() =>{setDetails(null)}}className="text-end  text-sm text-blue-500 font-semibold">show less</button>
              </div>
            </div>
          </div>
         ):''
        }        
        </div>
      ))}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>

        <span>{`Page ${currentPage} of ${data?.totalPages || 1}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages))
          }
          disabled={currentPage === data?.totalPages}
          className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Orders;
