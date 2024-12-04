import { createSlice } from "@reduxjs/toolkit";

const protectedCheckout=createSlice({
    name:'checkout',
    initialState:{
        protected:false
    },
    reducers:{
        setProtected:(state,action)=>{
            state.protected=action.payload
        },
        clearProtected:(state)=>{
            state.protected=false
        }
    }
})

export const {setProtected,clearProtected}=protectedCheckout.actions
export default protectedCheckout.reducer