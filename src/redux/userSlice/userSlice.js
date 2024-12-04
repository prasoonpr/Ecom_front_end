import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'user',
    initialState:{
        userProfile:{
            user_id:null,
            firstName:null,
            lastName:null,
            email:null
        }
    },
    reducers:{
        setUser:(state,action)=>{
            const {_id,firstName,lastName,email}=action.payload;
            state.userProfile.user_id=_id
            state.userProfile.firstName=firstName,
            state.userProfile.lastName=lastName,
            state.userProfile.email=email
        },
        clearUser:(state)=>{
            state.userProfile=null
        }
    }
})

export const{setUser,clearUser}=userSlice.actions
export default userSlice.reducer