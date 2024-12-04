/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import {  Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react';
import { useAddCouponsMutation } from '../../../services/adminApi';
import { toast } from 'sonner';



const ModalAddCoupons = ({handleAdd}) => {
    const [addcoupon,{error}]=useAddCouponsMutation()
  const [form,setForm]=useState({
    couponName:"",
    description:"",
    offer:'',
    minAmount:'',
    startDate:'',
    endDate:''
  })
  const handleForm=async(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const response= await addcoupon(form)
    if(response.data){
    toast.success(response.data.message)
       handleAdd()  
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={handleAdd}
          className="absolute right-2 top-2 text-gray-400 hover:text-white"
        >
          <CloseIcon fontSize="small" />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center text-white">ADD COUPONS</h2>
        {error&& <span className='text-center mb-4'><p className='text-red-500 text-sm'>{error.data.message}</p></span>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
          name='couponName'
          onChange={handleForm}
          value={form.couponName}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Coupon Name"
          type="text" />
          <input 
          name='description'
          onChange={handleForm}
          value={form.description}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Description"
          type="text" />
          <div className=' grid grid-cols-1 md:grid-cols-2 gap-2'>
         <input
          name='offer'
          onChange={handleForm}
          value={form.offer}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter offer percentage"
          type="number" />
            <input
          name='minAmount'
          onChange={handleForm}
          value={form.minAmount}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Min Amount"
          type="number" />
          </div>
         <div className='flex gap-3'>
            <div>
            <label className='text-sm text-gray-400' htmlFor='startDate'>Start Date</label>
            <input
            name='startDate'
            onChange={handleForm}
            value={form.startDate}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select Start Date"
            type="date" />
            </div>
            <div>
            <label className='text-sm text-gray-400' htmlFor='endDate'>End Date</label>
            <input
            name='endDate'
            onChange={handleForm}
            value={form.endDate}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select End Date"
            type="date" />
            </div>
         </div>
        
          <Button 
            type="submit" 
            variant="contained" 
            style={{
              width:"150px",
              backgroundColor: '#D97706',
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Add Coupon
          </Button>
        </form>
      </motion.div>
    </div>

  )
}

export default ModalAddCoupons
