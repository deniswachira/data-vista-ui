import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
    gdpData: any[];
    populationData: any[];
    gdpPerCapitaData: any[];
    exchangeRateData: any[];
}

const initialState: DataState = {
    gdpData: [],
    populationData: [],
    gdpPerCapitaData: [],
    exchangeRateData: [],
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
    },
});

export const {
    setGdpData,
    setPopulationData,
    setGdpPerCapitaData,
    setExchangeRateData,
} = dataSlice.actions;

export default dataSlice.reducer;
