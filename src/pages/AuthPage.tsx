import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import google from "../assets/google.svg";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthFormData } from "../lib/schemas";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { type } = useParams();
  const navigate = useNavigate();
  const { signup, login, signInWithGoogle } = useAuth();

  const isLogin = type === "login";

  useEffect(() => {
    if (type !== "login" && type !== "signup") {
      navigate("/auth/login");
    }
  }, [type, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setErrorMsg("");
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password);
      }
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
      <Link to="/" className="text-2xl sm:text-3xl font-extrabold">
        trackit
      </Link>
      <div className="md:flex flex-col items-center lg:justify-center">
        <form
          className="mt-10 md:w-2/3 lg:w-1/3"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              id="email"
              autoComplete="email"
              aria-label="email address"
              className={`border rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                errors.email ? "border-red-500" : "border-light"
              }`}
              placeholder="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="font-semibold">
              password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                aria-label="password"
                className={`border rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                  errors.password ? "border-red-500" : "border-light"
                }`}
                placeholder="password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            className="border w-full rounded px-2.5 py-2 font-semibold mt-4 mb-4 cursor-pointer disabled:opacity-50"
            type="submit"
          >
            {isSubmitting ? "loading..." : isLogin ? "log in" : "sign up"}
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
            <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
          )}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm px-2 text-gray-600">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <button
            className="border w-full rounded px-2.5 py-2 font-semibold mt-4 mb-4 flex justify-center cursor-pointer"
            onClick={handleGoogleAuth}
            type="button"
          >
            <img src={google} alt="google" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
