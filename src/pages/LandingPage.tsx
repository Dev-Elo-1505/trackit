import Hero from "../components/Hero"
import NavBar from "../components/NavBar"


const LandingPage = () => {
  return (
    <div className="flex flex-col px-6 py-4 sm:px-8 md:px-10">
        <NavBar />
        <Hero />
    </div>
  )
}

export default LandingPage