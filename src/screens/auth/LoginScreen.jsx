import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/actions/authActions";
import { RotatingLines } from "react-loader-spinner";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.loginReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    try {
      if (email.trim() != "" && password.trim() != "") {
        dispatch(login({ email, password }));
      } else {
        return alert("Please fill all inputs");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col gap-4 justify-start items-center w-[400px] border border-[#404040] rounded-lg p-2 bg-[#242423]">
        <h2 className="text-2xl font-bold">Login</h2>
        {error && <p className="text-red-600">{error}</p>}

        <form className="flex flex-col justify-center items-center gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
          />

          <div className="flex flex-col justify-end items-end gap-1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
            />

            <Link
              to="/forgot-password"
              className="text-blue-600 transform transition-all ease-in-out duration-200 hover:text-blue-700 active:scale-95"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="flex justify-center items-center mx-auto w-[350px] bg-[#424242] p-2 rounded-lg transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
          >
            {loading ? (
              <RotatingLines
                visible={true}
                height="30"
                width="30"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Login"
            )}
          </button>

          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 transform transition-all ease-in-out duration-200 hover:text-blue-700"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
