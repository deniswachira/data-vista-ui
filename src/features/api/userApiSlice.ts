import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserRegisterFormValues } from '../../types/Types';
import { UserLoginFormValues } from '../../types/Types';
import { TUser } from '../../types/Types';
import { apiDomain } from '../../proxxy/proxxy';


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiDomain }),
  tagTypes: ['user'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials: UserLoginFormValues, ) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerUser: builder.mutation<TUser,Partial<TUser>>({
      query: (userRegisterPayload: UserRegisterFormValues)=> ({
        url: 'auth/register',
        method: 'POST',
        body: userRegisterPayload,
      }),
    }),
    getUserById: builder.query({
      query: (user_id: number) => `users/${user_id}`,
      providesTags: ["user",]
    }),
  
    updateUserProfile: builder.mutation<TUser,Partial<TUser>>({
      query: ({ user_id, ...patch }) => ({
        url: `users/${user_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["user", ]
    }),
    upgradeUser: builder.mutation<boolean, number>({
      query: (user_id: number) => ({
        url: `users/${user_id}/upgrade`,
        method: 'PUT',
      }),
    }),   
    checkUserIsPremium: builder.query<boolean, number>({
      query: (user_id: number) => `users/${user_id}/isPremium`,
    }),
}),
});


