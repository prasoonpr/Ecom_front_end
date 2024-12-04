import { MenuItem, Select } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import ModalAddCoupons from './modals/ModalAddCoupons';
import { useBlockCouponMutation, useGetCouponsQuery } from '../../services/adminApi';
import ReusableTable from './ReusableTable';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const [blockCoupon]=useBlockCouponMutation()
  const [add,SetAdd]=useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] =useState(9) 
  const [totalPages,setTotalPages]=useState(1)
  const {data,isError}=useGetCouponsQuery({page:currentPage,limit:productsPerPage})
  const [coupons,setCoupons]=useState([])
  const headers=[
    {name:"NAME",key:"couponName"},
    {name:"OFFER (in %)",key:"offer"},
    {name:"MIN AMOUNT",key:"minAmount"},
    {name:"STARTING",key:"startDate"},
    {name:"ENDING",key:"endDate"},
  ]

  // for getting the coupons and asign to the state
  useEffect(()=>{
    if(data?.coupons){
      setCoupons([...data.coupons])
      setTotalPages(data.totalPages)
    }
  },[data])  

  //handle add coupons
  const handleAdd=()=>{
    SetAdd(!add)
  }

  //for handle block
  const handleBlock=async(id)=>{
    try {
      const response=await blockCoupon({id:id})
      if(response.data){
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error);   
    }
}

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="pt-14 bg-gray-800 min-h-screen ml-64 text-white"
  >
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">COUPONS</h1>
      <div className="flex items-center">
        <span className="mr-2 text-yellow-500 text-sm">Sort by</span>
        <Select
        //   value={sortBy}
        //   onChange={handleSort}
          className="bg-gray-700 text-white text-sm"
          IconComponent={ChevronDown}
          size="small"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="joinedOn">Joined On</MenuItem>
        </Select>
        <div className="flex items-center ml-2">
          <button onClick={handleAdd} className='bg-gray-900 p-2 rounded-lg'>add coupons</button>
      </div>
      </div>
    </div>
    {add&&(
      <ModalAddCoupons handleAdd={handleAdd}/>
    )}
    {isError? <div>Error While User Loading</div>:
    <ReusableTable list={coupons} handleBlock={handleBlock} headers={headers} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
    }
  </motion.div>
  )
}

export default AdminCoupons
