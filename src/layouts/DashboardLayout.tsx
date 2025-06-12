import { Outlet } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"


const DashboardLayout = () => {
  return (
    <div>
      <DashboardNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout