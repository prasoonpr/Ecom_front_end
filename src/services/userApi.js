import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";
// import apiSlice from "./api";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth, 
  endpoints: (builder) => ({
    checkUser: builder.mutation({
      query: (form) => ({
        url: "/user/check-user",
        method: "POST",
        body: form,
      }),
    }),
    verifyUser: builder.mutation({
      query: ({ otp }) => ({
        url: "/user/verify-user",
        method: "POST",
        body: { otp },
      }),
    }),
    resendOTP: builder.mutation({
      query: ({ email }) => ({
        url: "/user/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),
    login: builder.mutation({
      query: (form) => ({
        url: "/user/login",
        method: "POST",
        body: form,
      }),
    }),
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags:['getUserProfile']
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/user/log-out",
        method: "POST",
      }),
    }),
    listProducts:builder.query({
      query:({page,limit,filter,sortBy})=>`/user/list-products?page=${page}&limit=${limit}&filter=${filter}&sortBy=${sortBy}`,
      // query:({page,limit,filter,sortBy,searchTerm})=>`/user/list-products?page=${page}&limit=${limit}&filter=${filter}&sortBy=${sortBy}&searchTerm=${searchTerm}`,
      providesTags:['listProducts']
    }),
    getProductDetails:builder.query({
      query:({product_id,userId})=>`/user/get-product-details?product_id=${product_id}&userId=${userId}`,
      providesTags:['getProductDetails']
    }),
    loginWithGoogle:builder.mutation({
      query:(credential)=>({
        url:'/user/google-login',
        method:'POST',
        body:credential
      }),
    }),
    getReview:builder.query({
      query:({product_id})=>`/user/get-review?product_id=${product_id}`
    }),
    addAddress:builder.mutation({
      query:(form)=>({
        url:'/user/add-address',
        method:'POST',
        body:form
      }),
      invalidatesTags:['getAddresses']
    }),
    getAddresses:builder.query({
      query:()=>`/user/get-addresses`,
      providesTags:['getAddresses']
    }),
    editAddress:builder.mutation({
      query:(form)=>({
        url:'/user/edit-address',
        method:'POST',
        body:form
      }),
      invalidatesTags:['getAddresses']
    }),
    deleteAddress:builder.mutation({
      query:(address_id)=>({
        url:'/user/delete-address',
        method:'POST',
        body:address_id
      }),
      invalidatesTags:['getAddresses']
    }),
    editUserInfo:builder.mutation({
      query:(info)=>({
        url:'/user/edit-info',
        method:'POST',
        body:info
    }),
    invalidatesTags:['getUserProfile']
    }),
    changePass:builder.mutation({
      query:(password)=>({
        url:'/user/change-password',
        method:'POST',
        body:password
      })
    }),
    addCart:builder.mutation({
      query:(items)=>({
        url:'/user/add-cart',
        method:'POST',
        body:items
      }),
      invalidatesTags:['getProductDetails','getCartItems']
    }),
    getCartItems:builder.query({
      query:()=>'/user/get-cart-items',
      providesTags:['getCartItems']
    }),
    removeCart:builder.mutation({
      query:(product_id)=>({
        url:'/user/remove-cart',
        method:'POST',
        body:product_id
      }),
      invalidatesTags:['getCartItems','getProductDetails']
    }),
    placeOrder:builder.mutation({
      query:(items)=>({
        url:'/user/place-order',
        method:'POST',
        body:items
      }),
      invalidatesTags:['getCartItems','getOrders','getProductDetails']
    }),
    getOrders:builder.query({
      query:({page,limit})=>`/user/get-orders?page=${page}&limit=${limit}`,
      providesTags:['getOrders']
    }),
    cancellOrder:builder.mutation({
      query:({product_id,quantity,order_id})=>({
        url:'/user/cancell-order',
        method:'PUT',
        body:{product_id,quantity,order_id}
      }),
      invalidatesTags:['getOrders','listProducts','getProductDetails']
    }),
    addWishlist:builder.mutation({
      query:({product_id})=>({
        url:'/user/add-wishlist',
        method:'POST',
        body:{product_id}
      }),
      invalidatesTags:['getProductDetails','getWishlist']
    }),
    getWishlist:builder.query({
      query:()=>'/user/get-wishlist',
      providesTags:['getWishlist']
    }),
    removeWishlist:builder.mutation({
      query:({product_id})=>({
        url:'/user/remove-wishlist',
        method:'PUT',
        body:{product_id}
      }),
      invalidatesTags:['getWishlist','getProductDetails']
    }),
    getActiveCoupons:builder.query({
      query:()=>'/user/get-active-coupons',
      providesTags:['getActiveCoupons']
    }),
    getCode:builder.mutation({
      query:({coupon_id})=>({
        url:'/user/get-code',
        method:'POST',
        body:{coupon_id}
      }),
      invalidatesTags:['getActiveCoupons']
    }),
    applyCoupon:builder.mutation({
      query:({couponCode,totalAmount})=>({
        url:'/user/apply-coupon',
        method:'PUT',
        body:{couponCode,totalAmount}
      }),
      invalidatesTags:['getActiveCoupons']
    }),
    verifyPayment:builder.mutation({
      query:(items)=>({
        url:'/user/verify-payment',
        method:'POST',
        body:items
      }),
      invalidatesTags:['getCartItems','getOrders','getProductDetails']
    }),
    addWallet:builder.mutation({
      query:(item)=>({
        url:'/user/add-wallet',
        method:'POST',
        body:item
      }),
      invalidatesTags:['getWallet']
    }),
    getWallet:builder.query({
      query:()=>'/user/get-wallet',
      providesTags:['getWallet']
    }),
    getProductsForHome:builder.query({
      query:()=>'/user/get-products-for-home'
    }),
    setDefaultAddress:builder.mutation({
      query:({address_id})=>({
        url:'/user/set-default-address',
        method:'POST',
        body:{address_id}
      }),
      invalidatesTags:['getAddresses']
    }),
    searchProduct:builder.mutation({
      query:({term})=>({
        url:'/user/search-product',
        method:'POST',
        body:{term}
      })
    }),
    failureOrder:builder.mutation({
      query:(items)=>({
        url:'/user/failure-order',
        method:'POST',
        body:items
      }),
      invalidatesTags:['getCartItems','getOrders','getProductDetails']
    }),
    retryPayment:builder.mutation({
      query:(items)=>({
        url:'/user/retry-payment',
        method:'POST',
        body:items
      })
    }),
    verifyRetry:builder.mutation({
      query:(items)=>({
        url:'/user/verify-retry',
        method:'POST',
        body:items
      }),
      invalidatesTags:['getOrders']
    })
  }),
});

export const {
  useCheckUserMutation,
  useVerifyUserMutation,
  useResendOTPMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogOutMutation,
  useListProductsQuery,
  useGetProductDetailsQuery,
  useLoginWithGoogleMutation,
  useGetReviewQuery,
  useAddAddressMutation,
  useGetAddressesQuery,
  useEditAddressMutation,
  useDeleteAddressMutation,
  useEditUserInfoMutation,
  useChangePassMutation,
  useAddCartMutation,
  useGetCartItemsQuery,
  useRemoveCartMutation,
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useCancellOrderMutation,
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
  useGetActiveCouponsQuery,
  useGetCodeMutation,
  useApplyCouponMutation,
  useVerifyPaymentMutation,
  useAddWalletMutation,
  useGetWalletQuery,
  useGetProductsForHomeQuery,
  useSetDefaultAddressMutation,
  useSearchProductMutation,
  useFailureOrderMutation,
  useRetryPaymentMutation,
  useVerifyRetryMutation
} = userApi;
