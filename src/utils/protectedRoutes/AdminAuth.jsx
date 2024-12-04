/* eslint-disable react/prop-types */
// import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

 const AdminAuth = ({children}) => {
//  const token=useSelector(state=>state.adminAuth.token)
const token=localStorage.getItem('adminToken')
 if(token){
    return <Navigate to={'/admin'}/>
 }
 return children
}


export default AdminAuth
