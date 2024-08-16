import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HistoricalSharePrices = () => {
    const safaricomSharePriceData = useSelector((state: RootState) => state.data.safaricomSharePriceData);

    // Filter the initial data to include only entries from July 1st, 2024 onwards
    const initialFilteredData = safaricomSharePriceData
        .filter(item => new Date(item.date) >= new Date("2024-07-01"))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const [filteredData, setFilteredData] = useState(initialFilteredData);
    const [activeFilter, setActiveFilter] = useState<'2M' | '5D'>('2M'); // Default filter

    // Handle filter based on selected period within the filtered data
    const handleFilter = (period: '2M' | '5D') => {
        const today = new Date();
        let filtered = initialFilteredData;

        if (period === '2M') {
            const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
            filtered = initialFilteredData.filter(item => new Date(item.date) >= sixtyDaysAgo);
        } else if (period === '5D') {
            const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
            filtered = initialFilteredData.filter(item => new Date(item.date) >= fiveDaysAgo);
        }

        // Log data to check filtering results
        console.log("Filtered Data:", filtered);

        setFilteredData(filtered);
        setActiveFilter(period); // Set active filter
    };

    return (
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Historical Daily Share Prices of Safaricom (From July 1st, 2024)</h2>
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeFilter === '2M' ? 'bg-green-500 text-white' : 'bg-green-300 text-white'}`}
                    onClick={() => handleFilter('2M')}
                >
                    Last 2 Months
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeFilter === '5D' ? 'bg-green-500 text-white' : 'bg-green-300 text-white'}`}
                    onClick={() => handleFilter('5D')}
                >
                    Last 5 Days
                </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="close" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistoricalSharePrices;
