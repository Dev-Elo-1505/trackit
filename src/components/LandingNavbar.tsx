import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="flex justify-between items-center">
      <Link to="/" className="text-2xl sm:text-3xl font-extrabold">trackit</Link>
      <div className="flex gap-2">
        <Link className="btn btn-login" to="/auth/login">
          login
        </Link>
        <Link className="btn btn-signup" to='/auth/signup'>
          signup
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
