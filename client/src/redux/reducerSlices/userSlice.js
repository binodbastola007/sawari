import { createSlice } from "@reduxjs/toolkit";
 
export const initialState = {
  token: '',
  id:'',
  userDetails:{},
  isLoggedIn:false
};
 
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginDetails: (state, actions) => {
      const {isLoggedIn,token,userDetails} = actions.payload;
     return{
      ...state,
      token,
      isLoggedIn,
      userDetails
     }
    },
    changeUserDetails: (state, actions) => {
      state.userDetails = actions.payload
    },
    logout : (state) => {
          return{
          ...initialState
          }
         
    },
  }
});
 
export const { setLoginDetails, logout , changeUserDetails } = userSlice.actions;
export default userSlice.reducer;