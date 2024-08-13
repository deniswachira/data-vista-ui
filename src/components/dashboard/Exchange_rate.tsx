import {  useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector, } from 'react-redux';
import { RootState } from '../../app/store'; // Adjust the path as needed

interface ExchangeRateData {
    date: string;
    value: string;
}

const ExchangeRate = () => {

    // Fetch persisted data from Redux store
    const exchangeRateData = useSelector((state: RootState) => state.data.exchangeRateData);

    // Ensure that data is present before using it
    if (!exchangeRateData) {
        return <div>No data available.</div>;
    }

    const calculateYearlyMean = (data: ExchangeRateData[]) => {
        const yearlyData: { [year: string]: number[] } = {};

        data.forEach(item => {
            const year = new Date(item.date).getFullYear();
            if (!yearlyData[year]) {
                yearlyData[year] = [];
            }
            yearlyData[year].push(parseFloat(item.value));
        });

        const meanData = Object.keys(yearlyData).map(year => {
            const mean = yearlyData[year].reduce((sum, value) => sum + value, 0) / yearlyData[year].length;
            return {
                year: year,
                value: mean,
            };
        });

        return meanData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    };

    const formattedExchangeRateData = useMemo(() => calculateYearlyMean(exchangeRateData || []), [exchangeRateData]);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold mb-4">USD/KES Exchange Rate</h1>

            <div className="bg-white p-4 rounded-lg shadow-lg h-[300px]">
                <h2 className="text-2xl font-semibold mb-2">Historical USD/KES Exchange Rate</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedExchangeRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExchangeRate;
