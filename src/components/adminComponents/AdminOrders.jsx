import { motion } from 'framer-motion';
import LoadingModal from '../LoadingModal';
import { get } from 'lodash';
import { 
    Paper,
     TableContainer,
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableRow,
     Tooltip,
     } from '@mui/material';

import { ChevronLeft, ChevronRight,Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChangeOrderStatusMutation, useGetOrdersDetailsQuery } from '../../services/adminApi';
import ModalChangeStatus from './modals/ModalChangeStatus';
import { toast } from 'sonner';

const AdminOrders = () => {
    const [changeStatus,{error}]=useChangeOrderStatusMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] =useState(9) 
    const [totalPages,setTotalPages]=useState(1)
    const {data,isError,isLoading}=useGetOrdersDetailsQuery({page:currentPage,limit:productsPerPage})
    const [orders,setOrders]=useState([])
    const [userId,setUserId]=useState(null)
    const [orderId,setOrderId]=useState(null)
    const [status,setStatus]=useState(null)
    const [product_id,setProduct_id]=useState(null)
    const [quantity,setQuantity]=useState(null)

     // setting lists to state while mount
     useEffect(()=>{
        if(data&&data.orderItems){
            setOrders([...data.orderItems])
          setTotalPages(data.totalPages)
        }
      },[data])

//setting table headers
  const headers=[
    {name:"PRODUCT",key:"productDetails.productName"},
    {name:"QUANTITY",key:"items.quantity"},
    {name:"PRICE",key:"items.payableAmount"},
    {name:"USER",key:"userDetails.email"},
    {name:"STATUS",key:"items.order_status"},
  ]

  //edit control
  const handleEdit=(user_id,action,order_id,product_id,quantity)=>{
    setUserId(user_id)
    setOrderId(order_id)
    setStatus(action)
    setProduct_id(product_id)
    setQuantity(quantity)
  }

  //close edit
  const closeEdit=()=>{
    setUserId(null)
    setOrderId(null)
    setStatus(null)
  }

  //handle status change
  const handleStatus=async(user_id,order_id,action,product_id)=>{
    try {
        const response=await changeStatus({user_id:user_id,action:action,order_id:order_id,product_id:product_id,quantity})
        if(response.data){
            setUserId(null)
            setOrderId(null)
            setStatus(null)
             toast.success(response.data.message)
        }else{
          const errorMessage = error?.data?.message || "This item is cancelled";
          toast.error(errorMessage);
        }
    } catch (error) {
        toast.error(error)
    }
  }


    if(isLoading){
        return <LoadingModal/>
      }
    return (
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-14 bg-gray-800 min-h-screen ml-64 text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">ORDERS</h1>
          {/* <div className="flex items-center">
              <button onClick={()=>{}} className='bg-gray-900 p-2 rounded-lg'>add category</button>
          </div> */}
        </div>
        {isError&& <div>Error While User Loading</div>}
        <TableContainer component={Paper} sx={{ backgroundColor: "#111827" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{ color: "#F59E0B", fontSize: "13px" }}
              >
                {header.name}
              </TableCell>
            ))}
            <TableCell sx={{ color: "#F59E0B", fontSize: "13px" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((list, index) => (
            <TableRow key={index}>
              {headers.map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  sx={{ color: "white", fontSize: "11px" }}
                >
                    {/* {console.log(list)}
                  {list[header.key]} */}
                  {get(list, header.key, 'N/A')}
                </TableCell>

              ))}
              <TableCell>
                <div className="flex space-x-2">
                  
                  <Tooltip title="Change status">
                    <Pencil onClick={()=>handleEdit(list.userDetails._id,list.items.order_status,list.items._id,list.productDetails._id,list.items.quantity)} className="text-gray-500 cursor-pointer"size={19}/>
                  </Tooltip>
                 
                </div>
              </TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
      <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
              
                <span className="text-yellow-400">{`Page ${currentPage} of ${totalPages || 1}`}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
    </TableContainer>
       
       {userId&&orderId&&<ModalChangeStatus orderId={orderId} userId={userId} closeEdit={closeEdit} handleStatus={handleStatus} currentstatus={status} product_id={product_id} quantity={quantity}/>}
      </motion.div>
      )
}

export default AdminOrders
