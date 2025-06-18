import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardNavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center">
      <Link to="/" className="text-2xl sm:text-3xl font-extrabold">
        trackit
      </Link>

      <button className="btn btn-login" onClick={handleLogout}>
        logout
      </button>
    </header>
  );
};

export default DashboardNavBar;
