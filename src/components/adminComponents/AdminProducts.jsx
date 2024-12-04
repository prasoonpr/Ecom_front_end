import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGetActiveCategoryQuery, useGetProductsQuery, useProductBlockMutation } from '../../services/adminApi';
import LoadingModal from '../LoadingModal';
import ReusableTable from './ReusableTable';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ChevronDown } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { userApi } from '../../services/userApi';

const AdminProducts = () => {
  const navigate=useNavigate()
  // const dispatch=useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] =useState(9) 
  const [totalPages,setTotalPages]=useState(1)
  const [sortBy, setSortBy] = useState('latest');
  // const [filter, setfilter] = useState([]);
  const {data,isLoading,isError}=useGetProductsQuery({page:currentPage,limit:productsPerPage,sortBy:sortBy})
  const [productBlock]=useProductBlockMutation()
  const [products,setProducts]=useState([])
  const { data:category } = useGetActiveCategoryQuery();
  const [categoryList, setCategoryList] = useState([]);


  // for setting the products in a state
  useEffect(()=>{
    if(data&&data.productList){
      setProducts([...data.productList])
      setTotalPages(data.totalPages)
    }
    if (category && category.categoryList) {
     
      setCategoryList([...category.categoryList]);
    }
  },[data,category])

  // for block product
  const handleBlock=async(id)=>{
   await productBlock({id})
  //  dispatch(userApi.util.invalidateTags(['listProducts']));
  }

  //for handling the edit
  const handleEdit=async(id)=>{
    navigate(`/admin/products/edit-product/${id}`)
  }

  //setting table headers
  const headers=[
    {name:"PRODUCT",key:"productName"},
    {name:"STOCK",key:"stock"},
    {name:"CARAT",key:"carat"},
    {name:"PRICE",key:"price"},
    {name:"CATEGORY",key:"category"},
    {name:"ORIGIN",key:"origin"},
  ]

//for handling sort 
const handleSort = (event) => {
  setSortBy(event.target.value);
};
//for handling sort 
// const handlefilter = (event) => {
//   setfilter(event.target.value);
// };
 
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
            <div>
            <h1 className="text-2xl font-bold">PRODUCTS</h1>
            <div className="mb-4flex items-center">
               {/* <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label" sx={{ color: "white" }}>
               Filter By Category
              </InputLabel>
              <Select
                labelId="category-label"
                value={filter}
                onChange={handlefilter}
                label="Category"
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              >
                {categoryList.map((category,index)=>(
                
               <MenuItem key={index} value={category.category}>{category.category} </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            </div>
            </div>
            <div className='flex gap-3'>
            <div className="mb-4flex items-center">
              <span className="mr-2 text-yellow-400 text-sm">Sort by</span>
              <Select
                value={sortBy}
                onChange={handleSort}
                sx={{color:'white',backgroundColor:'#374151'}}
                IconComponent={ChevronDown}
                size="small"
              >
                <MenuItem  value="latest">Latest</MenuItem>
                <MenuItem  value="ascending">Name:aA - zZ </MenuItem>
                <MenuItem value="descending">Name:zZ - aA </MenuItem>
                <MenuItem value="lowToHigh">Price: low to high</MenuItem>
                <MenuItem value="highToLow">Price : high to low </MenuItem>
              </Select>
            </div>
            <div className="flex items-center">
                <button onClick={()=>{navigate('/admin/products/add-product')}} className='bg-gray-900 p-2 rounded-lg'>add product</button>
            </div>
            </div>
          </div>
          {isError? <div>Error While User Loading</div>:
          <ReusableTable list={products} handleBlock={handleBlock} headers={headers} handleEdit={handleEdit} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
          }
        </motion.div>
  )
}

export default AdminProducts
