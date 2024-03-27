import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import batabaseReducer from "./batabaseSlice";
const appStore = configureStore(
    {
        reducer:
        {
            user:userReducer,
            batabase:batabaseReducer
        }

    }
)
export default appStore