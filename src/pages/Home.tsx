
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";

const Home = () => {
  return (
    <div>
      <Container className="bg-white text-gray-900 flex flex-col gap-6">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </Container>
    </div>
  );
};

export default Home;
