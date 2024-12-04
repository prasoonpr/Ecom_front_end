/* eslint-disable react/prop-types */
// import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const Authenticated = ({children}) => {
  // const token=useSelector(state=>state.auth.token)
  const token= localStorage.getItem('userToken')
    if(token){
    return<Navigate to={'/'}/>
  }
return children
}

export default Authenticated
