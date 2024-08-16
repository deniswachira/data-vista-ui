import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiDomain } from '../../proxxy/proxxy';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({ baseUrl: apiDomain }),
       endpoints: (builder) => ({
        checkVoucher: builder.query({
            query: (voucher_code) => `one-voucher/${voucher_code}`,
        }),
      }),
    });
