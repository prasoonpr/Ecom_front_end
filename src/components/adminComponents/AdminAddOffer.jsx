import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAddOfferMutation, useGetActiveCategoryQuery, useGetProductsForOfferQuery } from '../../services/adminApi';
import {toast} from 'sonner'
import { useNavigate } from "react-router-dom";

const AdminAddOffer = () => {
  const navigate= useNavigate()
    const [addOffer,{error}]=useAddOfferMutation()
    const {data}=useGetActiveCategoryQuery()
    const {data:productList}=useGetProductsForOfferQuery()
    const [categoryList,setCategoryList]=useState([])
    const [products,setProducts]=useState([])
    const [form, setForm] = useState({
        offerName: "",
        offer: null,
        target_value: "",
        target_id: [],
        end_date: "",
      });
useEffect(()=>{
  if(data?.categoryList){
    setCategoryList([...data.categoryList])
  }
  if(productList?.products){
    setProducts([...productList.products])
  }
},[data,productList])

 //for handling form
  const handleForm = async (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setForm((prevForm) => {
      const targetIdArray = Array.isArray(prevForm.target_id) ? prevForm.target_id : [];
      const isAlreadySelected = targetIdArray.includes(value);
      return {
        ...prevForm,
        target_id: isAlreadySelected
          ? prevForm.target_id.filter((id) => id !== value)
          : [...prevForm.target_id, value],
      };
    });
  };

  //handle form submission
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const response=await addOffer(form)
    if(response.data){
      navigate('/admin/offers')
      toast.success(response.data.message)
      
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-800 text-white p-8 mt-5 ml-64"
    >
      <div className="max-w-4xl mx-auto bg-[#111827] rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label={
              error?.data?.messageToOfferName
                ? error.data.messageToOfferName
                : "Offer Name"
            }
            variant="outlined"
            name="offerName"
            value={form.offerName}
            onChange={handleForm}
            sx={
             {
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }
            }
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="outlined">
              <InputLabel id="target-label" sx={{ color: "white" }}>
                Target
              </InputLabel>
              <Select
                labelId="target-label"
                name="target_value"
                value={form.target_value}
                onChange={handleForm}
                // label="Target"
                label={
                  error?.data?.messageToTargetValue
                    ? error.data.messageToTargetValue
                    : "Target"
                }
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
               
                  <MenuItem  value='category'>
                    category
                  </MenuItem>
                  <MenuItem  value='product'>
                    product
                  </MenuItem>
              
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={
                error?.data?.messageToStock
                  ? error.data.messageToStock
                  : "Offer (in %)"
              }
              type="number"
              variant="outlined"
              name="offer"
              value={form.offer}
              onChange={handleForm}
              sx={
             {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
             
        </div>

          <div className="flex flex-cols-1 md:flex-cols-2 gap-4">
           
            <FormControl fullWidth variant="outlined">
              <InputLabel id="target_id-label" sx={{ color: "white" }}>
                Select Item
              </InputLabel>
              <Select
                labelId="target_id-label"
                value={form.target_id || []}
                // label="Select"
                label={
                  error?.data?.messageToTargetId
                    ? error.data.messageToTargetId
                    : "Select"
                }
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
               {form.target_value=='category'?(
                categoryList.map((category,index)=>(
                 <MenuItem key={index}  >
                  <Checkbox 
                  value={category.category}
                  checked={form?.target_id?.includes(category.category)}
                  onChange={handleCheckboxChange}
                />
                 {category.category}
               </MenuItem>
                ))
               ):(
               products.map((product,index)=>(
                <MenuItem key={index} >
                <Checkbox 
                  value={product._id}
                  checked={form?.target_id?.includes(product._id)}
                  onChange={handleCheckboxChange}
                />
                {product.productName}
              </MenuItem>
               ))
               )}
                  
              
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={
                error?.data?.messageToEndDate
                  ? error.data.messageToEndDate
                  : "End Date"
              }
              variant="outlined"
              name="end_date"
              value={form.end_date}
              onChange={handleForm}
              type='date'
              sx={
                 {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
          </div>
          {error&&( <p className='text=sm text-red-500 pt-2'>{error.data.message}</p>)}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            Add Product
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

export default AdminAddOffer
