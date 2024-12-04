// import { TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useAddAddressMutation, useDeleteAddressMutation, useEditAddressMutation, useGetAddressesQuery, useSetDefaultAddressMutation } from "../../services/userApi"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from "@mui/material";
import DeleteModal from "../DeleteModal";
import { validateAddressform } from "../../utils/user/FormValidation";
import { toast } from "sonner";

const AddressManage = () => {
  const [setDefault]=useSetDefaultAddressMutation()
  const {data}=useGetAddressesQuery()
  const [addAddress]=useAddAddressMutation()
  const [editAddress]=useEditAddressMutation()
  const [deleteAddress]=useDeleteAddressMutation()
  const [formOpen,setFormOpen]=useState(false)
  const [addresses,setAddresses]=useState([])
  const [options,setOptions]=useState(null)
  const [edit,setEdit]=useState(false)
  const [deleteOpen,setDeleteOpen]=useState(null)
  const [err,setErr]=useState(false)
  
  const [form,setForm]=useState({
    name:'',
    phone:'',
    pincode:'',
    locality:'',
    address:'',
    city:'',
    state:'',
    landmark:'',
    alternativePhone:'',
    addressType:'home'
  })
  
  useEffect(() => {
    if(data?.addresses){
      setAddresses(data.addresses)
    }
  }, [data]);

  //for handling form changes
  const handleForm=async(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }
//handle edit click
const handleEdit=async(id)=>{
  const address=addresses.find(address=>address._id===id)
  setForm(address)
  setEdit(true)
  setFormOpen(true)
}

//handle form close
const handleFormClose=async()=>{
  setForm({
    name:'',
    phone:'',
    pincode:'',
    locality:'',
    address:'',
    city:'',
    state:'',
    landmark:'',
    alternativePhone:'',
    addressType:''
  })
  setEdit(false)
  setFormOpen(false)
  setErr(false)
}

//for edit form submit
const handleEditSubmit=async(e)=>{
  e.preventDefault()
  const validate= validateAddressform(form)
  if(validate===false){
    return setErr(true)
  }else{
    setErr(false)
  }
  
  const response=await editAddress(form)
  if(response.data){
    handleFormClose()
    toast.success(response.data.message)
  }
}

//handle delete click
const handleDelete=async(id)=>{
  setDeleteOpen(id)
}

// handle delete submit
const handleDeleteSubmit=async(id)=>{
const response=await deleteAddress({address_id:id})
if(response.data){
  setDeleteOpen(null)
  toast.success(response.data.message)
}
}

// for closing the delete modal
const handleDeleteClose=()=>{
  setDeleteOpen(null)
}

  //for form submit
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const validate= validateAddressform(form)
    if(validate===false){
      return setErr(true)
    }else{
      setErr(false)
    }
    const response=await addAddress(form)
    if(response.data){
      handleFormClose()
      toast.success(response.data.message)
    }
  }

  //for setting default address
  const setDefaultAddress=async(address_id)=>{
    const response=await setDefault({address_id})
    if(response.data){
      toast.success(response.data.message)
    }
  }

  return (
    <div className='bg-white shadow-md flex flex-col rounded-sm ml-6  p-6'>
    <h1 className="font-semibold text-lg">Manage Addresses</h1>
    {formOpen?(
        <form onSubmit={edit?handleEditSubmit:handleSubmit} className="border bg-blue-50 rounded-sm p-6 my-6 ">
          <h1 className="font-semibold text-sm text-blue-500">{edit?"EDIT ADDRESS":"ADD A NEW ADDRESS"}</h1>
          <div className="flex justify-start gap-4 my-4 w-[600px] ">
            <input onChange={handleForm} type="text" name="name" value={form.name} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow  h-12  placeholder:text-sm" placeholder="*Name" />
            <input onChange={handleForm} type="number" name="phone" value={form.phone} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm " placeholder="*Phone" />
          </div>
          <div className="flex justify-start gap-4 my-4 w-[600px]">
            <input onChange={handleForm} type="number" name="pincode" value={form.pincode} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm " placeholder="*Pincode" />
            <input onChange={handleForm} type="text" name="locality" value={form.locality} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm " placeholder="*Locality" />
          </div>
          <input onChange={handleForm} type="text" name="address" value={form.address} className="p-3 border-2 focus:outline-none focus:border-blue-500 h-24 placeholder:text-sm w-[600px]" placeholder="*Address(area and street)" />
          <div className="flex justify-start gap-4 my-4 w-[600px] ">
            <input onChange={handleForm} type="text" name="city" value={form.city} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow  h-12 placeholder:text-sm " placeholder="*City/District/Town" />
            <input onChange={handleForm} type="text" name="state" value={form.state} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm " placeholder="*State" />
          </div>
          <div className="flex justify-start gap-4 my-4 w-[600px]">
            <input onChange={handleForm} type="text" name="landmark" value={form.landmark} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm "  placeholder="LandMark(optional)" />
            <input onChange={handleForm} type="number" name="alternativePhone" value={form.alternativePhone} className="p-3 border-2 focus:outline-none focus:border-blue-500 flex-grow h-12 placeholder:text-sm " placeholder="Alternative Phone(optional)" />
          </div>
          <p className="text-sm text-gray-500 ml-4">Address Type</p>
          <div className="flex ml-3 mt-3">
          
           <label className="flex items-center mr-4">
              <input 
                type="radio" 
                name="addressType" 
                value="home" 
                checked={form.addressType === "home"} 
                onChange={handleForm} 
                className="form-radio text-blue-500" 
              />
              <span className="ml-2">Home</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="addressType" 
                value="work" 
                checked={form.addressType === "work"} 
                onChange={handleForm} 
                className="form-radio text-blue-500" 
              />
              <span className="ml-2">Work</span>
            </label>
          </div>
         {err&& <p className="text-sm text-red-500">please fill the required fields</p>}
          <button type="submit" className="h-12 w-56 mt-3 shadow-lg rounded-sm text-white text-sm font-semibold  bg-blue-500">SAVE</button>
          <button className=" mt-3 ml-6 text-blue-500 text-sm font-semibold  " onClick={handleFormClose}>CANCEL</button>
        </form>

    ):(
      <button onClick={()=>{setFormOpen(true)}} className="w-full h-12 my-6 border text-start font-semibold text-sm text-blue-500 pl-5">+ ADD A NEW ADDRESS</button>
    )}
  {addresses.map((address,index)=>(
  <div key={index} className=" flex flex-row justify-between h-32 p-4 w-full mb-2 border-2 text-sm font-semibold ">
    
    <div className="flex">
    <div>
      <input
        value={address._id}
        checked={address.defaultAddress}
        className="cursor-pointer"
        onChange={(e) => {
          setDefaultAddress(e.target.value);
        }}
        type="radio"
        title="set as default"
      />
    </div>
      <div className="ml-2">
        {address.name},<br />
        {address.phone},{address.pincode},{address.locality},<br />
        {address.address},{address.city},{address.state},
        {address.landmark},<br /><br />
        Address Type:-{address.addressType}
      </div>
    </div>
    <div>
      {options===index?(
        <div className="border-2 h-16 w-16 rounded-sm shadow-lg flex flex-col justify-around " onMouseLeave={()=>{setOptions(null)}}>
          <button onClick={()=>{handleEdit(address._id)}} className="hover:text-blue-500 text-sm">edit</button>
          <button onClick={()=>handleDelete(address._id)} className="hover:text-red-500 text-sm">delete</button>
        </div>
      ):(
      <IconButton
      onMouseEnter={()=>{setOptions(index)}}
      >
        <MoreVertIcon  sx={{color:"gray",cursor:"pointer" }}/>
      </IconButton>
      )}
    </div>
  </div>
    
  ))
  }
  {deleteOpen&&<DeleteModal onClose={handleDeleteClose} onConfirm={handleDeleteSubmit} id={deleteOpen}/>}
    </div>
  )
}

export default AddressManage
