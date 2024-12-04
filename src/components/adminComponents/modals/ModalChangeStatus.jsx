/* eslint-disable react/prop-types */
import { Button, MenuItem, Select } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import { motion } from 'framer-motion';
import { useState } from "react";

const status=["Pending", "Shipped", "Delivered","Cancelled"]

const ModalChangeStatus = ({userId,orderId,closeEdit,handleStatus ,currentstatus,product_id,quantity}) => {
    const [action,setAction]=useState(currentstatus)
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
          onClick={closeEdit}
          className="absolute right-2 top-2 text-gray-400 hover:text-white"
        >
          <CloseIcon fontSize="small" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">CHANGE ORDER STATUS</h2>
        <Select
              
                value={action}
                onChange={(e)=>{setAction(e.target.value)}}
                sx={{
                    width:'200px',
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
                {status.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
          <Button 
          onClick={()=>handleStatus(userId,orderId,action,product_id,quantity)}
            type="submit" 
            variant="contained" 
            style={{
              width:"150px",
              backgroundColor: '#D97706',
              color: 'white',
              marginLeft:'8px',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
           SAVE CHANGES
          </Button>
      </motion.div>
      </div>
  )
}

export default ModalChangeStatus
