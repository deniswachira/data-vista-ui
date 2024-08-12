
import heroImage from "../assets/hero.png"; // Import the image file
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="relative flex flex-col md:flex-row h-[50vh]">
            {/* Left Section with Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden">
                <img
                    src={heroImage}
                    alt="Hero"
                    className="w-80 h-80 object-fit"
                />
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center  p-4 md:p-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Your Data Hub</h1>
                    <p className="text-base md:text-lg mb-8">Analyze, visualize, and gain insights</p>
                    <button className="bg-success btn-outline text-white py-2 px-6 rounded-lg shadow-lg hover:bg-success-dark">
                        <Link to="register">Get Started</Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
