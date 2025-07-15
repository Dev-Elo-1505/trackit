import { Link } from "react-router-dom"
import Features from "../components/Features"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Testimonials from "../components/Testimonials"


const HomePage = () => {
  return (
    <div>
        <Hero />
        <Features />
        <Testimonials />
        <div className="h-96 flex justify-center items-center flex-col">
          <h3 className="font-bold text-5xl mb-4">get started for free</h3>
          <p></p>
          <Link to="/auth/signup">
          <button className="mb-4 bg-primary hover:bg-[#ffd23e] mt-2 w-40 h-12 text-lg font-semibold rounded-lg transition-colors duration-300 cursor-pointer">try trackit free</button></Link>
        </div>
        <Footer />
    </div>
  )
}

export default HomePage