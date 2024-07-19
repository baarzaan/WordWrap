import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../redux/actions/authActions";
import { RotatingLines } from "react-loader-spinner";

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { loading, resetPasswordText, error } = useSelector(
    (state) => state.resetPasswordReducer
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSendResetPasswordLink = (e) => {
    e.preventDefault();

    try {
      if (email.trim() != "") {
        dispatch(resetPassword(email));
      } else {
        return alert("Please enter your email");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4 justify-start items-center w-[400px] border border-[#404040] rounded-lg p-2 bg-[#242423]">
        <div className="flex justify-between items-center w-full px-2">
          <Link
            title="Back to login"
            to="/login"
            className="transform transition-all ease-in-out duration-200 hover:bg-[#424242]/50 rounded-full p-1 active:scale-95"
          >
            <IoIosArrowBack size={22} />
          </Link>

          <h2 className="text-2xl font-bold">Forgot Password</h2>

          <span></span>
        </div>

        {resetPasswordText ? (
          <p className="text-white">{resetPasswordText}</p>
        ) : (
          <>
            {error && <p className="text-red-600">{error}</p>}
          </>
        )}

        <form className="flex flex-col justify-center items-center gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
          />

          <button
            onClick={handleSendResetPasswordLink}
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
              "Send Reset Password Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
