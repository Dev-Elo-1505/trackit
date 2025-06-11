import Features from "../components/Features"
import Hero from "../components/Hero"
import NavBar from "../components/NavBar"
import Testimonials from "../components/Testimonials"


const LandingPage = () => {
  return (
    <div className="flex flex-col px-6 py-4 sm:px-8 md:px-10 lg:px-16 md:py-8 lg:py-10 ">
        <NavBar />
        <Hero />
        <Features />
        <Testimonials />
    </div>
  )
}

export default LandingPage