import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { userApi } from "../../features/api/userApiSlice";

// Define the type for the premium status response
interface PremiumStatus {
    isPremium: boolean;
}

const HistoricalInflationTrend = () => {
    const inflationData = useSelector((state: RootState) => state.data.inflationRateData);
    const user = useSelector((state: RootState) => state.auth.user);
    const user_id = user?.user.user_id;
    const [filteredData, setFilteredData] = useState(inflationData);
    const [activeFilter, setActiveFilter] = useState<string>('YTD');
    const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | undefined>(undefined); // Local state for premium status
    const [isLoading, setIsLoading] = useState<boolean>(true); // Local state for loading

    const { data, isFetching } = userApi.useCheckUserIsPremiumQuery(user_id);

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

    // Filter data based on selected period
    const handleFilter = (period: string) => {
        const today = new Date();
        let filtered = inflationData;

        if (period === 'YTD') {
            filtered = inflationData.filter(item => {
                const itemDate = new Date(item.month + " 1, 2024");
                return itemDate >= new Date(today.getFullYear(), 0, 1);
            });
        } else if (period === '3M') {
            const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
            filtered = inflationData.filter(item => {
                const itemDate = new Date(item.month + " 1, 2024");
                return itemDate >= threeMonthsAgo;
            });
        } else if (period === '1M') {
            const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            filtered = inflationData.filter(item => {
                const itemDate = new Date(item.month + " 1, 2024");
                return itemDate >= oneMonthAgo;
            });
        }

        setFilteredData(filtered);
        setActiveFilter(period); // Update active filter
    };

    return (
        <div className="bg-white text-gray-900 p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-600">Historical Monthly Inflation Trend</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    className={`px-3 py-2 rounded ${activeFilter === 'YTD' ? 'bg-purple-600 text-white' : 'bg-purple-300 text-purple-600'}`}
                    onClick={() => handleFilter('YTD')}
                >
                    YTD
                </button>
                <button
                    className={`px-3 py-2 rounded ${activeFilter === '3M' ? 'bg-purple-600 text-white' : 'bg-purple-300 text-purple-600'}`}
                    onClick={() => handleFilter('3M')}
                >
                    3M
                </button>
                <button
                    className={`px-3 py-2 rounded ${activeFilter === '1M' ? 'bg-purple-600 text-white' : 'bg-purple-300 text-purple-600'}`}
                    onClick={() => handleFilter('1M')}
                >
                    1M
                </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistoricalInflationTrend;
