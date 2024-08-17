import { useState } from "react";
import { SquareUserRound, LogOut, BarChart, DollarSign, ChevronDown, ChevronUp, TrendingUp, History, DollarSignIcon, } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCredentials } from "../features/auth/authSlice";

function SideNav() {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearCredentials());
        navigate('/login');
    };

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <ul className="menu bg-base-200 min-w-full  text-base-content min-h-full p-2">
            <li>
                <Link to="" className="flex items-center">
                    <SquareUserRound className="text-4xl text-yellow-600 mr-4" />
                    <span className="hidden lg:inline ml-2 font-bold text-yellow-600">Me</span>
                </Link>
            </li>

            {/* Dropdown for Macroeconomic Analysis */}
            <li>
                <button
                    className="flex items-center w-full"
                    onClick={() => toggleDropdown(1)}
                >
                    <BarChart className="text-4xl text-blue-600 mr-4" />
                    <span className="hidden lg:inline ml-2 font-bold text-blue-600">Macroeconomic Analysis</span>
                    <span className="ml-auto text-blue-600">
                        {activeDropdown === 1 ? <ChevronUp /> : <ChevronDown />}
                    </span>
                </button>
                {activeDropdown === 1 && (
                    <ul className="ml-2 mt-2 space-y-2">
                        <li>
                            <Link to="gdp-population" className="flex items-center">
                                <TrendingUp className="text-blue-600 text-xl mr-2" />
                                <span className="hidden lg:inline text-blue-600">GDP</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="exchange-rate" className="flex items-center">
                                <DollarSignIcon className="text-blue-600 text-xl mr-2" />
                                <span className="hidden lg:inline text-blue-600">Exchange</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </li>

            {/* Dropdown for Inflation */}
            <li>
                <button
                    className="flex items-center w-full"
                    onClick={() => toggleDropdown(2)}
                >
                    <BarChart className="text-4xl text-purple-600 mr-2" />
                    <span className="hidden lg:inline ml-2 font-bold text-purple-600">Inflations</span>
                    <span className="ml-auto text-purple-600">
                        {activeDropdown === 2 ? <ChevronUp /> : <ChevronDown />}
                    </span>
                </button>
                {activeDropdown === 2 && (
                    <ul className="ml-2 mt-2 space-y-2">
                        <li>
                            <Link to="monthly-inflation" className="flex items-center">
                                <TrendingUp className="text-purple-600 text-xl mr-2" />
                                <span className="hidden lg:inline text-purple-600">Monthly</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="historical-inflation" className="flex items-center">
                                <History className="text-purple-600 text-xl mr-2" />
                                <span className="hidden lg:inline text-purple-600">Historical</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </li>

            {/* Dropdown for Financial Analysis */}
            <li>
                <button
                    className="flex items-center w-full"
                    onClick={() => toggleDropdown(3)}
                >
                    <DollarSign className="text-4xl text-green-600 mr-2" />
                    <span className="hidden lg:inline ml-2 font-bold text-green-600">Financial Analysis</span>
                    <span className="ml-auto text-green-600">
                        {activeDropdown === 3 ? <ChevronUp /> : <ChevronDown />}
                    </span>
                </button>
                {activeDropdown === 3 && (
                    <ul className="ml-2 mt-2 space-y-2">
                        <li>
                            <Link to="share-prices" className="flex items-center">
                                <DollarSign className="text-green-600 text-xl mr-2" />
                                <span className="hidden lg:inline text-green-600">Daily Share Prices</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="historical-prices" className="flex items-center">
                                <History className="text-green-600 text-xl mr-2" />
                                <span className="hidden lg:inline text-green-600">Historical Share Prices</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </li>

            <li>
                <button onClick={handleLogout} className="flex items-center">
                    <LogOut className="text-4xl text-red-600 mr-4" />
                    <span className="hidden lg:inline ml-2 font-bold text-red-600">Logout</span>
                </button>
            </li>

            <li>
                <Link to="/" className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-house text-4xl text-green-600 mr-4"
                    >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <span className="hidden lg:inline ml-2 font-bold text-green-600">Home</span>
                </Link>
            </li>
        </ul>
    );
}

export default SideNav;
