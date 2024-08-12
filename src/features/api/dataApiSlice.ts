import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiDomain } from '../../proxxy/proxxy';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiDomain }),
  tagTypes: ['data'],
  endpoints: (builder) => ({
    getGdp: builder.query({
      query: () => 'gdp',
      providesTags: ['data'],
    }),
    getPopulation: builder.query({
      query: () => 'population',
      providesTags: ['data'],
    }),
    getGdpPerCapita: builder.query({
        query: () => 'gdp_per_capita',
      providesTags: ['data'],
    }),
  }),
});