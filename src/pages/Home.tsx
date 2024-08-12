import { useState } from "react";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";

const Home = () => {  

  return (
    <div>
      <Container className="bg-base-200 flex flex-col gap-6">
        <Navbar />
        
        
        <Footer />
      </Container>
    </div>
  );
};

export default Home;
