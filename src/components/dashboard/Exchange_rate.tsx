import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store'; // Adjust the path as needed

interface ExchangeRateData {
    date: string;
    value: string;
}

const ExchangeRate = () => {
    // Fetch persisted data from Redux store
    const exchangeRateData = useSelector((state: RootState) => state.data.exchangeRateData);

    // State to store the selected period filter
    const [period, setPeriod] = useState<'5Y' | '2Y' | 'YTD' | '3M' | '1M'>('YTD');

    // Ensure that data is present before using it
    if (!exchangeRateData) {
        return <div>No data available.</div>;
    }

    // Get the start date based on the selected period
    const getStartDate = (period: string) => {
        const now = new Date();
        switch (period) {
            case '5Y':
                return new Date(now.setFullYear(now.getFullYear() - 5));
            case '2Y':
                return new Date(now.setFullYear(now.getFullYear() - 2));
            case 'YTD':
                return new Date(now.getFullYear(), 0, 1);
            case '3M':
                return new Date(now.setMonth(now.getMonth() - 3));
            case '1M':
                return new Date(now.setMonth(now.getMonth() - 1));
            default:
                return new Date('2019-01-01');
        }
    };

    // Format, filter, and sort data based on the selected period
    const formattedExchangeRateData = useMemo(() => {
        const startDate = getStartDate(period);
        return exchangeRateData
            .filter((item: ExchangeRateData) => new Date(item.date) >= startDate)
            .map((item: ExchangeRateData) => ({
                date: new Date(item.date).toISOString().split('T')[0], // Convert date to YYYY-MM-DD format
                value: parseFloat(item.value), // Convert value to a number
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date
    }, [exchangeRateData, period]);

    // Calculate the domain (min and max values) for the Y-axis with some padding
    const yDomain = useMemo(() => {
        const values = formattedExchangeRateData.map((d) => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.1; // 10% padding
        return [min - padding, max + padding];
    }, [formattedExchangeRateData]);

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">USD/KES Exchange Rate</h1>

            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    className={`px-4 py-2 ${period === '5Y' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
                    onClick={() => setPeriod('5Y')}
                >
                    5Y
                </button>
                <button
                    className={`px-4 py-2 ${period === '2Y' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
                    onClick={() => setPeriod('2Y')}
                >
                    2Y
                </button>
                <button
                    className={`px-4 py-2 ${period === 'YTD' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
                    onClick={() => setPeriod('YTD')}
                >
                    YTD
                </button>
                <button
                    className={`px-4 py-2 ${period === '3M' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
                    onClick={() => setPeriod('3M')}
                >
                    3M
                </button>
                <button
                    className={`px-4 py-2 ${period === '1M' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
                    onClick={() => setPeriod('1M')}
                >
                    1M
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg h-[300px] md:h-[500px]">
                <h2 className="text-lg md:text-2xl font-semibold mb-2 text-blue-600">Historical USD/KES Exchange Rate</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedExchangeRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={yDomain} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} activeDot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExchangeRate;
