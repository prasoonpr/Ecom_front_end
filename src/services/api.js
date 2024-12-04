import {  fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api",
  // baseUrl: "http://192.168.1.9:4000/api",
  credentials: 'include',
  prepareHeaders: (headers, { extraOptions }) => {
    const isAdminRequest = extraOptions?.isAdmin;
    const token =isAdminRequest?localStorage.getItem('adminToken'): localStorage.getItem('userToken')

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const isAdminRequest = extraOptions?.isAdmin;
    const refreshUrl = isAdminRequest ? "/admin/refresh-token" : "/user/refresh-token";
    const refreshResult = await baseQuery(refreshUrl, api, extraOptions);
    if (refreshResult.data) {
      if(isAdminRequest){
        localStorage.setItem('adminToken',refreshResult.data.accessToken)
      }else{
        localStorage.setItem('userToken',refreshResult.data.accessToken)

      }
      
      result = await baseQuery(args, api, extraOptions);
      
    } else {
  
      isAdminRequest?localStorage.removeItem('adminToken'):localStorage.removeItem('userToken')
      
    }
  }
 
  return result;
};

