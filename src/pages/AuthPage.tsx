import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import google from "../assets/google.svg";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { type } = useParams();
  const navigate = useNavigate();
  const { signup, login, signInWithGoogle } = useAuth();

  const isLogin = type === "login";

  useEffect(() => {
    if (type !== "login" && type !== "signup") {
      navigate("/auth/login");
    }
  }, [type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formFields.email, formFields.password);
      } else {
        await signup(formFields.email, formFields.password);
      }
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg((error as Error).message);
      
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-4 sm:px-8 md:px-10 lg:px-16 md:py-8 lg:py-10">
      <Link to="/" className="text-2xl sm:text-3xl font-extrabold">trackit</Link>
      <div className="md:flex flex-col items-center lg:justify-center">
        <form className="mt-10 md:w-2/3 lg:w-1/3" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-center md:text-2xl">
            ready when you are
          </h2>
          <p className="text-darkText text-center">your smart habit tracker</p>
          <div className="mt-7">
            <label htmlFor="email" className="font-semibold">
              email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              aria-label="email address"
              className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="email"
              value={formFields.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="font-semibold">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              aria-label="password"
              className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="password"
              value={formFields.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            disabled={loading}
            className="border w-full rounded px-2.5 py-2 font-semibold mt-4 mb-4 cursor-pointer"
            type="submit"
          >
            {loading ? "loading..." : isLogin ? "log in" : "sign up"}
          </button>
          <p className="text-center text-sm text-gray-400">
            {isLogin ? (
              <>
                don't have an account ?{" "}
                <Link to="/auth/signup" className="cursor-pointer">
                  sign up
                </Link>
              </>
            ) : (
              <>
                already have an account ?{" "}
                <Link to="/auth/login" className="cursor-pointer">
                  log in
                </Link>
              </>
            )}
          </p>
          {errorMsg && (
            <p className="text-red-500 text-sm text-center mt-2">an error occured. please try again.</p>
          )}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm px-2 text-gray-600">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <button
            className="border w-full rounded px-2.5 py-2 font-semibold mt-4 mb-4 flex justify-center cursor-pointer"
            onClick={handleGoogleAuth}
          >
            <img src={google} alt="google" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
