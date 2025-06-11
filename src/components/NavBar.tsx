const NavBar = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl sm:text-3xl font-extrabold">trackit</h1>
      <div className="flex gap-2">
        <button className="btn btn-login">
          login
        </button>
        <button className="btn btn-signup">
          signup
        </button>
      </div>
    </header>
  );
};

export default NavBar;
