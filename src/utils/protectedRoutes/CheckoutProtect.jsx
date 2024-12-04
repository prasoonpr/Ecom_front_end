/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"


const CheckoutProtect = ({children}) => {
  const isProtected=  useSelector(state=>state.protectedCheckout.protected)
  if(!isProtected){
    return <Navigate to={'/view-cart'}/>
  }
  return children
}

export default CheckoutProtect
