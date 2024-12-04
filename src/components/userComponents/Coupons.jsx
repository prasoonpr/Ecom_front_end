import { useEffect, useState } from "react"
import { useGetActiveCouponsQuery, useGetCodeMutation } from "../../services/userApi"
import { toast } from 'sonner';
const Coupons = () => {
  const {data}=useGetActiveCouponsQuery()
  const [getCode]=useGetCodeMutation()
  const [availableCoupons,setAvailableCoupons]=useState([])
  const [upComing,setUpComing]=useState([])
  useEffect(()=>{
    if(data?.coupons){
      const available = data?.coupons.filter(coupon => 
        new Date(coupon.endDate) >= Date.now() && 
        new Date(coupon.startDate) <= Date.now()
      );     
      const upComing=data.coupons.filter(coupon=>
        new Date(coupon.startDate)>Date.now()
      )
       setAvailableCoupons(available)
       setUpComing(upComing)
    }
  },[data])

  //for get coupon code
  const handleGetCode=async(coupon_id)=>{
    const response =await getCode({coupon_id})
    if(response.data){
      toast.success(response.data.message)
    }
  }
  
  return (
    <div className='bg-white shadow-md flex flex-col rounded-sm ml-6 w-full p-6'>
      <h1 className="font-semibold mb-4">Available Coupons</h1>
      <div className="border-2 w-2/3 h-auto">
      {availableCoupons.map((coupon,index)=>(
        <div key={index} className="relative border-b-2 h-24 flex justify-between p-5">
          {coupon?.user?.status && (
                    <div className='absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center '>
                        <h1 className='text-red-600 font-bold text-lg'>Applied !</h1>
                    </div>    
                  )}
          <div className="flex flex-col">
              <h1 className="text-green-700 font-semibold">{coupon.couponName } <span className="text-sm">(%{coupon.offer} off)</span></h1>
              <span className="text-xs mt-2">Min Amount: {coupon.minAmount}</span>
          </div>
          <div className="flex flex-col text-end">
              <span className="text-sm font-semibold text-gray-500">validate until:{new Date(coupon.endDate).toLocaleDateString()}</span>
              {coupon?.user?.couponCode?(
                <span className="text-green-700  mt-2 text-sm font-semibold">{coupon.user.couponCode}</span>
              ):(
                <button onClick={()=>handleGetCode(coupon._id)} className="text-blue-500 mt-2 text-sm font-semibold">Get Code</button>
              )}
          </div>
        </div>
      ))}
      </div>
      <h1 className="font-semibold mt-4 mb-4">UpComing Coupons</h1>
      <div className="border-2 w-2/3 h-auto">
      {upComing.map((coupon,index)=>(
        <div key={index} className="border-b-2 h-24 flex justify-between p-5">
          <div className="flex flex-col">
              <h1 className="text-green-700 font-semibold">{coupon.couponName } <span className="text-sm">(%{coupon.offer} off)</span></h1>
              <span className="text-xs mt-2">Min Amount: {coupon.minAmount}</span>
          </div>
          <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500"> comes at:{new Date(coupon.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default Coupons
