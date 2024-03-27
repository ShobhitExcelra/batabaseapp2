import { createSlice } from "@reduxjs/toolkit";

const batabaseSlice = createSlice({
    name:'batabase',
    initialState:null,
    reducers:{
        addBatabase:(state,action)=>{
            return action.payload
        },
        removeBataBase:(state,action)=>{
            return null
        }
    }
})
export const {addBatabase, removeBataBase} = batabaseSlice.actions;
export default batabaseSlice.reducer;