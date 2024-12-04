/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import {  Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react';
import { useAddCategoryMutation } from '../../../services/adminApi';

const ModalAddCategory = ({handleAdd}) => {
  const [addCategory,{error}]=useAddCategoryMutation()
  const [form,setForm]=useState({
    category:"",
    description:"",
  })
  const handleForm=async(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const response= await addCategory(form)
    if(response.data){
      // setCategoryList((old)=>[...old,form])
      await handleAdd()  
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
        <h2 className="text-2xl font-bold mb-6 text-center text-white">ADD CATEGORIES</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
          name='category'
          onChange={handleForm}
          value={form.category}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Category"
          type="text" />
         {error&& <span><p className='text-red-500 text-sm'>{error.data.messageToCategory}</p></span>}
          <input 
          name='description'
          onChange={handleForm}
          value={form.description}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Description"
          type="text" />
         {error&& <span><p className='text-red-500 text-sm'>{error.data.messageToDescription}</p></span>}
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
            Add Category
          </Button>
        </form>
      </motion.div>
    </div>

  )
}

export default ModalAddCategory
