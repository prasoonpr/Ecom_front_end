/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { toast } from "sonner"
import { useGetActiveCouponsQuery, useGetCodeMutation } from "../../../services/userApi"
import { useEffect, useState } from "react"

const CouponModal = ({onClick}) => {
  const {data}=useGetActiveCouponsQuery()
  const [getCode]=useGetCodeMutation()
  const [availableCoupons,setAvailableCoupons]=useState([])
  useEffect(()=>{
    if(data?.coupons){
      const available = data?.coupons.filter(coupon => 
        new Date(coupon.endDate) > Date.now() && 
        new Date(coupon.startDate) <= Date.now()
      );     
       setAvailableCoupons(available)
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
     
      <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            maxHeight: "70vh", 
          }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900" id="modal-title">
              Available Coupons
            </h2>
            <button onClick={onClick} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div
            className="p-4 overflow-y-auto"
            style={{
              maxHeight: "calc(90vh - 60px)", // Subtracting header height for scrollable content
            }}
          >
            {availableCoupons.map((coupon, index) => (
              <div key={index} className="relative border-b-2 h-24 flex justify-between p-5">
                {coupon?.user?.status && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
                    <h1 className="text-red-600 font-bold text-lg">Applied !</h1>
                  </div>
                )}
                <div className="flex flex-col">
                  <h1 className="text-green-700 font-semibold">{coupon.couponName} <span className="text-sm">(%{coupon.offer} off)</span></h1>
                  <span className="text-xs mt-2">Min Amount: {coupon.minAmount}</span>
                </div>
                <div className="flex flex-col text-end">
                  <span className="text-sm font-semibold text-gray-500">
                    validate until: {new Date(coupon.endDate).toLocaleDateString()}
                  </span>
                  {coupon?.user?.couponCode ? (
                    <span className="text-green-700 mt-2 text-sm font-semibold">{coupon.user.couponCode}</span>
                  ) : (
                    <button
                      onClick={() => handleGetCode(coupon._id)}
                      className="text-blue-500 mt-2 text-sm font-semibold"
                    >
                      Get Code
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      )
}

export default CouponModal
