import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const InflationComparison = ({ data }: { data: { month: string; inflation: number }[] }) => {
    if (data.length < 2) {
        return <p>Not enough data to compare.</p>;
    }

    const currentMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];

    const difference = (currentMonth.inflation - previousMonth.inflation).toFixed(2);
    const percentageChange = ((parseFloat(difference) / previousMonth.inflation) * 100).toFixed(2);

    return (
        <div className="bg-white text-gray-900 py-6 px-4 md:py-12 md:px-8 rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Inflation Comparison</h2>
            <p className="flex items-center">
                <strong>Current Month ({currentMonth.month}):</strong> {currentMonth.inflation}%
            </p>
            <p className="flex items-center">
                <strong>Previous Month ({previousMonth.month}):</strong> {previousMonth.inflation}%
            </p>
            <p className="flex items-center">
                <strong>Difference:</strong> {difference}% ({percentageChange}% change)
                {parseFloat(difference) >= 0 ? (
                    <FaArrowUp className="text-red-500 ml-2" />
                ) : (
                    <FaArrowDown className="text-green-500 ml-2" />
                )}
            </p>
        </div>
    );
};

const InflationPage = () => {
    const inflationData = [
        { month: "June 2024", inflation: 4.6 },
        { month: "July 2024", inflation: 4.3 },
    ];

    return (
        <div
            className="bg-cover bg-center min-h-screen"
            style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}
        >
            <div className="bg-gradient-to-r from-white to-transparent py-5 px-4 md:px-8 min-h-screen">
                <h1 className="text-center text-xl md:text-2xl font-bold text-gray-900 my-4">Monthly Inflation Analysis Comparison</h1>

                <div className="mb-5">
                    <InflationComparison data={inflationData} />
                </div>

                <div className="bg-white text-gray-900 py-6 px-4 md:py-12 md:px-8 rounded-lg shadow-md">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Monthly Inflation Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={inflationData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="inflation" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default InflationPage;
