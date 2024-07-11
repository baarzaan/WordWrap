import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../../firebase/firebaseConfig";
import { register } from "../../redux/actions/authActions";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.registerReducer);
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleUploadPhoto = async () => {
    try {
      const storageRef = ref(storage, `${photo.name}`);
      await uploadBytes(storageRef, photo);
      const photoURL = await getDownloadURL(storageRef);
      return photoURL;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (
        photo &&
        firstName.trim() != "" &&
        lastName.trim() != "" &&
        username.trim() != "" &&
        email.trim() != "" &&
        password.trim() != ""
      ) {
        let photoURL = null;
        photoURL = await handleUploadPhoto();

        const userData = {
          photoURL,
          firstName,
          lastName,
          username,
          email,
          password,
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        dispatch(register(userData));
      } else {
        return alert("Please fill all inputs");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4 justify-start items-center w-[400px] border border-[#404040] rounded-lg p-2 bg-[#242423]">
        <h2 className="text-2xl font-bold">Register</h2>
        {error && <p className="text-red-600">{error}</p>}

        <form className="flex flex-col justify-center items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
          />

          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-[170px] bg-transparent p-2 border border-[#404040] rounded-lg"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-[170px] bg-transparent p-2 border border-[#404040] rounded-lg"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-[350px] bg-transparent p-2 border border-[#404040] rounded-lg"
          />

          <button
            onClick={handleRegister}
            className="w-[350px] bg-[#424242] p-2 rounded-lg transform transition-all ease-in-out duration-200 hover:opacity-80 active:scale-95"
          >
            Register
          </button>

          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 transform transition-all ease-in-out duration-200 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
