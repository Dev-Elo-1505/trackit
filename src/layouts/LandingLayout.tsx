import { Outlet } from "react-router-dom"
import LandingNavbar from "../components/LandingNavbar"


const LandingLayout = () => {
  return (
    <div className="flex flex-col px-6 py-4 sm:px-8 md:px-10 lg:px-16 md:py-8 lg:py-10">
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default LandingLayout