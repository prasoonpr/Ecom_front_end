import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {  ChevronDown } from 'lucide-react';
import { useGetUserListsQuery, useUserBlockMutation } from '../../services/adminApi';
import ReusableTable from './ReusableTable';
import { MenuItem, Select } from '@mui/material';
import LoadingModal from '../LoadingModal';

const AdminUser = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] =useState(9) 
  const [totalPages,setTotalPages]=useState(1)
  const [userBlock]=useUserBlockMutation()
  const [sortBy, setSortBy] = useState('name');
  const {data,isLoading,isError}=useGetUserListsQuery({page:currentPage,limit:productsPerPage,sortBy:sortBy})
  const [usersList,setUsersList]=useState([])

const headers=[
  {name:"EMAIL",key:"email"},
  {name:"ROLE",key:"role"},
  {name:"USER",key:"firstName"},
  {name:"JOINED ON",key:"date"},
  
]
  //for store users lists in a state
    useEffect(()=>{
      if(data && data.usersList){
      setUsersList([...data.usersList])
      setTotalPages(data.totalPages)
      }
    },[data])
    
// for handle user block and unblock
  const handleBlock=async(id)=>{
      try {
        await userBlock({id})
      } catch (error) {
        console.log(error);   
      }
  }

  //for handling sort 
    const handleSort = (event) => {
      setSortBy(event.target.value);
    };

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
            <h1 className="text-2xl font-bold">USERS</h1>
            <div className="flex items-center">
              <span className="mr-2 text-yellow-500 text-sm">Sort by</span>
              <Select
                value={sortBy}
                onChange={handleSort}
                className="bg-gray-700 text-white text-sm"
                IconComponent={ChevronDown}
                size="small"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="joinedOn">Joined On</MenuItem>
              </Select>
            </div>
          </div>
          {isError? <div>Error While User Loading</div>:
          <ReusableTable list={usersList} handleBlock={handleBlock} headers={headers} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
          }
        </motion.div>
      );
}

export default AdminUser
