import { FaChartLine, FaDatabase, FaCogs } from "react-icons/fa";

const features = [
    {
        id: 1,
        icon: <FaChartLine size={30} />,
        title: "Real-time Analytics",
        description: "Access up-to-date financial data and insights.",
    },
    {
        id: 2,
        icon: <FaDatabase size={30} />,
        title: "Extensive Datasets",
        description: "Explore a wide range of macroeconomic datasets.",
    },
    {
        id: 3,
        icon: <FaCogs size={30} />,
        title: "Customizable Tools",
        description: "Personalize your analysis with configurable settings.",
    },
];

const FeaturesSection = () => {
    return (
        <div className="bg-white text-gray-900 py-12 px-8 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((feature) => (
                <div key={feature.id} className="flex flex-col items-center text-center">
                    <div className="bg-blue-500 text-white p-4 rounded-full mb-4 shadow-md">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeaturesSection;
