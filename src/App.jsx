import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Logo from "./assets/img/logo.png";
import { routes } from "./routes/Routes";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./redux/actions/authActions";
import { getUsers } from "./redux/actions/usersActions";
import { getChats } from "./redux/actions/chatActions";

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  console.log('App component loading:', loading);
  console.log('App component user:', user);
  console.log('App component error:', error);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getUsers());
    dispatch(getChats());
  }, [dispatch]);

  return (
    <Router>
      {loading ? (
        <div className="h-screen flex flex-col justify-between items-center py-2">
          <span></span>
          <img src={Logo} className="h-[100px]" alt="" />

          <p>
            Developed by{" "}
            <Link
              to="https://instagram.com/baarzan5"
              target="_blank"
              className="text-blue-600 transform transition-all ease-in-out duration-200 hover:text-blue-700"
            >
              Barzan
            </Link>
          </p>
        </div>
      ) : (
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isPrivate ? (
                  <PrivateRoutes>{route.element}</PrivateRoutes>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Routes>
      )}
    </Router>
  );
}

export default App;
