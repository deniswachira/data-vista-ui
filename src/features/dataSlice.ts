import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
    gdpData: any[];
    populationData: any[];
    gdpPerCapitaData: any[];
    exchangeRateData: any[];
    inflationRateData: any[];
    safaricomSharePriceData: any[];
}

const initialState: DataState = {
    gdpData: [],
    populationData: [],
    gdpPerCapitaData: [],
    exchangeRateData: [],
    inflationRateData: [],
    safaricomSharePriceData: [],
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setGdpData(state, action: PayloadAction<any[]>) {
            state.gdpData = action.payload;
        },
        setPopulationData(state, action: PayloadAction<any[]>) {
            state.populationData = action.payload;
        },
        setGdpPerCapitaData(state, action: PayloadAction<any[]>) {
            state.gdpPerCapitaData = action.payload;
        },
        setExchangeRateData(state, action: PayloadAction<any[]>) {
            state.exchangeRateData = action.payload;
        },
        setInflationRateData(state, action: PayloadAction<any[]>) {
            state.inflationRateData = action.payload;
        },
        setSafaricomSharePriceData(state, action: PayloadAction<any[]>) {
            state.safaricomSharePriceData = action.payload;
        },
    },
});

export const {
    setGdpData,
    setPopulationData,
    setGdpPerCapitaData,
    setExchangeRateData,
    setInflationRateData,
    setSafaricomSharePriceData,
} = dataSlice.actions;

export default dataSlice.reducer;
