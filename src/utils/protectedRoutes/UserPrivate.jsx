/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"

const UserPrivate = ({children}) => {
    const token=localStorage.getItem('userToken')
    if(!token){
        return<Navigate to={'/'}/>
    }
    return children
}

export default UserPrivate
