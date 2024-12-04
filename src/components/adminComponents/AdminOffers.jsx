import { MenuItem, Select } from "@mui/material"
import { motion } from 'framer-motion';
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBlockOfferMutation, useGetOffersQuery } from "../../services/adminApi";
import { useEffect, useState } from "react";
import ReusableTable from "./ReusableTable";
import LoadingModal from "../LoadingModal";
import {toast} from 'sonner'


const AdminOffers = () => {
    const navigate=useNavigate()
    const [blockOffer]=useBlockOfferMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] =useState(9) 
    const [totalPages,setTotalPages]=useState(1)
    const [sortBy, setSortBy] = useState('latest');
    const {data,isLoading,isError}=useGetOffersQuery({page:currentPage,limit:productsPerPage,sortBy:sortBy})
    const [offers,setOffers]=useState([])

    useEffect(()=>{
      if(data?.offers){
        const formattedData = data.offers.map(item => ({
          ...item,
          end_date: new Date(item.end_date).toLocaleDateString(), // Formats `end_date` to a local date string
        }));
        setOffers([...formattedData])
        setTotalPages(data.totalPages)
      }
    },[data])

     //setting table headers
  const headers=[
    {name:"NAME",key:"offerName"},
    {name:"OFFER (in %)",key:"offer"},
    {name:"TARGET",key:"target_value"},
    {name:"TARGET_ID",key:"target_id"},
    {name:"END DATE",key:"end_date"},
  ]

  //for handling sort 
const handleSort = (event) => {
  setSortBy(event.target.value);
};

  const handleBlock=async(id)=>{
    const response=await blockOffer({id})
    if(response.data){
      toast.success(response.data.message)
    }
   }

   if(isLoading){
    return<LoadingModal/>
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
          value={sortBy}
          onChange={handleSort}
          className="bg-gray-700 text-white text-sm"
          IconComponent={ChevronDown}
          size="small"
        >
           <MenuItem  value="latest">Latest</MenuItem>
          <MenuItem  value="ascending">Name:aA - zZ </MenuItem>
          <MenuItem value="descending">Name:zZ - aA </MenuItem>
          <MenuItem value="lowToHigh">Offer: low to high</MenuItem>
          <MenuItem value="highToLow">Offer : high to low </MenuItem>
        </Select>
        <div className="flex items-center ml-2">
          <button onClick={()=>{navigate('/admin/offers/add-offers')}} className='bg-gray-900 p-2 rounded-lg'>add coupons</button>
      </div>
      </div>
    </div>
   
    {isError? <div>Error While User Loading</div>:
    <ReusableTable list={offers} handleBlock={handleBlock} headers={headers} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
    }
  </motion.div>
  )
}

export default AdminOffers
