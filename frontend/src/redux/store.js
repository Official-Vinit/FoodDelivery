import { configureStore } from "@reduxjs/toolkit";
import userslice from "./userSlice"

export const store = configureStore({
    reducer:{
        user:userslice
    }
})