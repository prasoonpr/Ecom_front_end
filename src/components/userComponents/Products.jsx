import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Filter,} from 'lucide-react'
import { Button, InputBase, MenuItem, Rating, Select,} from '@mui/material'
import { Search as SearchIcon, } from '@mui/icons-material';
import { useListProductsQuery, useSearchProductMutation } from '../../services/userApi'
import {useNavigate} from 'react-router-dom'
import { useGetActiveCategoryQuery } from '../../services/adminApi';
import useDebounce from '../../utils/DebounceHook';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const Products = () => {
  const navigate= useNavigate()
  const [searchProduct,{isLoading}]=useSearchProductMutation()
  const { data:category } = useGetActiveCategoryQuery();
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] =useState(9) 
  const [filter,setFilter]=useState([])
  const [sortBy, setSortBy] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm=useDebounce(searchTerm,500)
  const {data}=useListProductsQuery({page:currentPage,limit:productsPerPage,filter:JSON.stringify(filter),sortBy:sortBy})
  const [products,setProducts]=useState([])
  const [categoryList, setCategoryList] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchedProducts,setSearchedProducts]=useState([])
  const [searchFocused, setSearchFocused] = useState(false);


  useEffect(()=>{
    if(data&&data.productList){
      setProducts([...data.productList])
    }
    if(category&&category.categoryList){
      setCategoryList([...category.categoryList])
    }
  },[data,category])

 
  
  //for navigate to product details page
  const handleProduct=async(id)=>{
    navigate(`/products/product-details/${id}`)
  }
  
  //for handlig category change
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilter((prevFilter) => 
    checked 
      ? [...prevFilter, value]        
      : prevFilter.filter((item) => item !== value) 
  );
  };

//for handling sort 
  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

//for handle search input
  const searchInput = async(term) => {
      const response=await searchProduct({term})
      if(response?.data){
        if(response.data.searchProduct.length>0){
          setSearchedProducts([...response.data.searchProduct])
        }else{
          setSearchedProducts([{productName:'No Results Found'}])
        }
      }
  };
  

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchInput(debouncedSearchTerm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[debouncedSearchTerm]);

    return (
          <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
         className="flex min-h-screen flex-col bg-[#E5E7EB]"
        >
        <div className="flex flex-1">
          <aside
            className={`fixed left-0 top-[64px] z-20 h-[calc(100vh-64px)] w-64 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 ease-in-out ${
              isFilterOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-4">
              <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
             
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Category</h3>
                 {categoryList.map((category,index)=>(
                      <label key={index} className="flex items-center">
                      <input onChange={handleCategoryChange} checked={filter.includes(category.category)} name={category.category} value={category.category} type="checkbox" className="mr-2" />
                      {category.category}
                      </label>
                 ))}
                </div>
              </div>
            </div>
          </aside>
          <main className={`flex-grow transition-all duration-300 ${isFilterOpen ? 'ml-64' : 'ml-0'}`}>
            <div className="container mx-auto px-4 py-8">
             <div className='flex flex-row justify-between'>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="mb-4 flex items-center gap-2 rounded bg-[#374151] px-4 py-2 text-white"
              >
                <Filter size={20} />
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
               {/* Search Input */}
              <div className=" mx-auto relative">
                     <motion.div 
                        className={`flex items-center bg-bodyColor rounded-full px-3 py-1 ${searchFocused ? 'ring-2 ring-navbarColor' : 'ring-2 ring-gray-400'}`}
                        animate={{ width: searchFocused ? 300 : 200 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SearchIcon className="text-gray-400 mr-2" />
                        <InputBase
                         value={searchTerm}
                         onChange={(e) => {
                           const term = e.target.value.toLowerCase();
                           if (term) {
                             setSearchTerm(term);
                           } else {
                             setSearchTerm('')
                             setSearchedProducts([]); 
                           }
                         }}
                          placeholder="Search..."
                          className="text-white w-full"
                          onFocus={() => setSearchFocused(true)}
                          onBlur={() => setSearchFocused(false)}
                        />
                      </motion.div>
                {/* Dropdown List */}
                  <ul className="mt-2 bg-gray-100 rounded-lg shadow-md absolute z-50">
                    {isLoading?(
                      <li className="px-4 py-2 w-56 cursor-pointer border-b last:border-b-0  hover:bg-white">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20px' }}>
                        <CircularProgress size={20} />
                      </Box>
                      </li>
                    ):(
                      searchedProducts.map((product, index) => (
                        <li
                        onClick={()=>handleProduct(product._id)}
                          key={index}
                          className="px-4 py-2 cursor-pointer border-b last:border-b-0  hover:bg-white"
                        >
                          <div className='flex justify-between'>
                          <span className="font-semibold mr-1">{product?.productName}</span> 
                          <span className="text-gray-600 ml-5 text-sm">{product.carat} {product.carat&&'carat'}</span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
              </div>
              <div className="mb-4flex items-center">
              <span className="mr-2 text-navbarColor text-sm">Sort by</span>
              <Select
                value={sortBy}
                onChange={handleSort}
                sx={{color:'white',backgroundColor:'#374151'}}
                IconComponent={ChevronDown}
                size="small"
              >
                <MenuItem  value="ascending">aA - zZ </MenuItem>
                <MenuItem value="descending">zZ - aA </MenuItem>
                <MenuItem value="lowToHigh">Price: low to high</MenuItem>
                <MenuItem value="highToLow">Price : high to low </MenuItem>
                <MenuItem value="outofstock">Hide Out Of Stock </MenuItem>
              </Select>
            </div>
             </div>
              <div  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const totalStars=product.review.reduce((acc,obj)=>acc+obj.star,0)
                  const avgStar=Math.round(totalStars/product.review.length)
                  return(
                  <div key={product._id} onClick={()=>handleProduct(product._id)} className="rounded-lg bg-white p-3 shadow cursor-pointer">
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      className="mb-2 h-32 w-full object-contain"
                    />
                    <div className="mx-1 flex">
                      <Rating value={avgStar} readOnly size="small" />
                    </div>
                    <div className='flex justify-between py-3'>
                    <h2 className="text-sm font-semibold">{product.productName}</h2>
                    <p className="text-xs text-gray-600">{product.carat} Carats</p>
                    </div>
                    <div className='flex justify-between'>
                    <p className="text-xs text-gray-600">Origin:{product.origin} </p>
                    <p className="text-sm font-bold">₹{product.price}</p>
                    </div>
                  </div>
               
                )})}
              </div>
  
              
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages))}
                  disabled={currentPage === data?.totalPages}
                  className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </main>
        </div>


        {/*fake footer  */ }
        <footer className="bg-[#374151] text-white p-8 mt-">
        <div className="container mx-auto text-center">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt="Footer Ring"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h3 className="text-xl font-bold mb-2">OUR STORE</h3>
          <p className="mb-4 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Button 
            variant="outlined" 
            className="text-white border-white hover:text-yellow-400 hover:border-yellow-400"
          >
            CONTACT US
          </Button>
        </div>
      </footer>
      </motion.div>
    )
}

export default Products
