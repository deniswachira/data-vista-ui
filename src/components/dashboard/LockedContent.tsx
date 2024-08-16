import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { userApi } from "../../features/api/userApiSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define the type for the premium status response
interface PremiumStatus {
    isPremium: boolean;
}

const LockedContent = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const user_id = user?.user.user_id;
    const safaricomSharePriceData = useSelector((state: RootState) => state.data.safaricomSharePriceData);
    const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | undefined>(undefined); // Local state for premium status
    const [isLoading, setIsLoading] = useState<boolean>(true); // Local state for loading
    const { data, isFetching } = userApi.useCheckUserIsPremiumQuery(user_id);

    // Sort data by date in ascending order
    const sortedData = [...safaricomSharePriceData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const [filteredData, setFilteredData] = useState(sortedData);
    const [activeFilter, setActiveFilter] = useState<'3M' | '1M' | '5D'>('3M'); // Default filter

    useEffect(() => {
        // Triggered when component mounts or user_id changes
        if (!isFetching) {
            if (data !== undefined) {
                setPremiumStatus(data as unknown as PremiumStatus);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [data, isFetching, user_id]);

    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (premiumStatus?.isPremium === false) {
        return (
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-purple-600">Access Restricted</h2>
                <p className="mb-4">This content is only accessible to full members.</p>
                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = 'upgrade'} // Redirect to the upgrade page
                >
                    Click here to become a full member
                </button>
            </div>
        );
    }

    // Handle filter based on selected period within the filtered data
    const handleFilter = (period: '3M' | '1M' | '5D') => {
        const today = new Date();
        let filtered = sortedData;

        if (period === '3M') {
            const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
            filtered = sortedData.filter(item => new Date(item.date) >= ninetyDaysAgo);
        } else if (period === '1M') {
            const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
            filtered = sortedData.filter(item => new Date(item.date) >= thirtyDaysAgo);
        } else if (period === '5D') {
            const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
            filtered = sortedData.filter(item => new Date(item.date) >= fiveDaysAgo);
        }

        setFilteredData(filtered);
        setActiveFilter(period); // Set active filter
    };

    return (
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Historical Daily Share Prices of Safaricom (From June 2024)</h2>
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeFilter === '3M' ? 'bg-green-500 text-white' : 'bg-green-300 text-white'}`}
                    onClick={() => handleFilter('3M')}
                >
                    Last 3 Months
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeFilter === '1M' ? 'bg-green-500 text-white' : 'bg-green-300 text-white'}`}
                    onClick={() => handleFilter('1M')}
                >
                    Last 1 Month
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

export default LockedContent;
