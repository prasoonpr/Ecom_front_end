/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useChangePassMutation, useEditUserInfoMutation } from "../../services/userApi";
import { toast } from "sonner";

const Profile = () => {
  const [changePassword,{error}]=useChangePassMutation()
  const [editUserInfo]=useEditUserInfoMutation()
  const [editInfo,setEditInfo]=useState(false)
  const [truePass, setTruePass] = useState(false);
  const [changePass,setChangePass]=useState(false)
  const [confirmPassword,setConfirmPassword]=useState('')
  const [err,setErr]=useState(false)
  const [er,setEr]=useState(false)
  const [info,setInfo]=useState({
    firstName:'',
    lastName:''
  })
  const [password,setPassword]=useState({
    oldPass:'',
    password:'',
  })
  const userData=useSelector((state)=>state.user.userProfile)
  useEffect(() => {
    if(userData){
      setInfo(userData)
    }
  }, [userData]);
  //handle input change
  const handleChange=async(e)=>{
    setInfo({
      ...info,
      [e.target.name]:e.target.value
    })
  }
  //for handle password
  const handlePass = async (e) => {
    const setpass = await e.target.value;
    setConfirmPassword(setpass)
    if (setpass == password.password) {
      setTruePass(false);
    } else {
      setTruePass(true);
    }
  };
  //for handling the password input change
  const handlePassword=async(e)=>{
    setPassword({
      ...password,
      [e.target.name]:e.target.value
    })
  }

  //for close password form
  const handleClosePassword=()=>{
    setPassword({
      oldPass:'',
      password:'',
    })
    setConfirmPassword('')
    setTruePass(false)
    setChangePass(false)
    setErr(false)
  }

//for handling the personal information submit
const handleSubmit=async()=>{
  if(info.firstName.trim()===''){
    return setEr(true)
  }
  const response=await editUserInfo(info)
  if(response.data){
    setEr(false)
    setEditInfo(false)
    toast.success('Saved changes')
  }
} 

//for handling change password submit
const handlePasswordSubmit=async()=>{
  const passwordRegex =/^.{8,}$/
  if(!passwordRegex.test(password.password)){
    return setErr(true)
  }
  const response=await changePassword(password)
  if(response.data){
    handleClosePassword()
    toast.success("Password change successfully")
  }
}
  return (
    <div className='bg-white shadow-md flex flex-col rounded-sm ml-6 w-full p-6'>
      <div className="flex">
        <h1 className="font-semibold text-lg">Personal Information</h1>
        <button onClick={()=>{setEditInfo(!editInfo)}} className="text-blue-500 text-sm font-semibold ml-5">{editInfo?"Cancel":"Edit"}</button>
      </div>
    <div className="mt-5">
      {er&&<p className="ml-3 text-sm text-red-500">This field cannot be empty</p>}
      <input onChange={handleChange} type="text" name="firstName" value={info.firstName} className={`h-12 w-1/3 bg-gray-100 p-2 ml-3 ${!editInfo&&'cursor-not-allowed text-gray-500'}`} disabled={!editInfo} />
      <input onChange={handleChange} type="text" name="lastName" value={info.lastName} className={`h-12 w-1/3 bg-gray-100 p-2 ml-3  ${!editInfo&&'cursor-not-allowed text-gray-500'}`} disabled={!editInfo} />
      {editInfo&&<button onClick={handleSubmit} className="text-white bg-blue-500 h-12 w-20 rounded-sm shadow-md ml-3">SAVE</button>}
    </div>

    <h1 className="font-semibold text-lg mt-10">Email</h1>
    <div className="mt-5">
      <input type="text" value={userData.email} className="h-12 w-1/3 bg-gray-100 p-2 ml-3 cursor-not-allowed text-gray-700" disabled/>
    </div>
    {changePass?(
      <div className=" flex flex-col border mt-10 bg-blue-50 w-3/4 rounded-sm p-6 my-6 ">
       <h1 className="font-semibold text-lg text-blue-500">Change Password</h1>
       <input onChange={handlePassword} type="password" name="oldPass"  value={password.oldPass} className="p-3 mt-3 border-2 focus:outline-none focus:border-blue-500 flex-grow w-1/2  h-12  placeholder:text-sm" placeholder="*Old Password" />
       {error&&<p className="text-sm text-red-500">{error.data.message}</p>}
       <input onChange={handlePassword} type="password" name="password" value={password.password}  className="p-3 mt-3 border-2 focus:outline-none focus:border-blue-500 flex-grow w-1/2  h-12  placeholder:text-sm" placeholder="*New Password" />
       {err&&<p className="text-sm text-red-500">Password must be 8 character</p>}
       <input onChange={handlePass} type="text" name="confirmPass" value={confirmPassword}  className="p-3 mt-3 border-2 focus:outline-none focus:border-blue-500 flex-grow w-1/2  h-12  placeholder:text-sm" placeholder="*confirm Password" />
       {truePass&&<p className="text-sm text-red-500">Password not match</p>}
       <div className="flex">
       <button onClick={handlePasswordSubmit} className="h-12 w-56 mt-3 shadow-lg rounded-sm text-white text-sm font-semibold  bg-blue-500">SAVE</button>
       <button className=" mt-3 ml-6 text-blue-500 text-sm font-semibold  " onClick={handleClosePassword}>CANCEL</button>
       </div>
      </div>
    ):(
      <div className="flex mt-10">
       <h1 className="font-semibold text-lg ">Change Password</h1>
        <button onClick={()=>{setChangePass(true)}} className="text-blue-500 text-sm font-semibold ml-5">Edit</button>
      </div>
    )}


<h1 className="mt-10 text-lg font-bold">FAQs</h1>
<p className="text-sm font-semibold mt-2">What happens when I update my email address (or mobile number)?</p>
<p className="text-sm mt-1">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
<p className="text-sm font-semibold mt-2">When will my Gemas Delujo account be updated with the new email address (or mobile number)?</p>
<p className="text-sm mt-1">It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
<p className="text-sm font-semibold mt-2">What happens to my existing Gemas Delujo account when I update my email address (or mobile number)?</p>
<p className="text-sm mt-1">Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
<p className="text-sm font-semibold mt-2">Does my Seller account get affected when I update my email address?</p>
<p className="text-sm mt-1">Gemas Delujo has a 'single sign-on' policy. Any changes will reflect in your Seller account also.</p>



    </div>
  )
}

export default Profile
