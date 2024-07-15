import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/Routes";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./redux/actions/authActions";
import { getUsers } from "./redux/actions/usersActions";
import { getChats } from "./redux/actions/chatActions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getUsers());
    dispatch(getChats());
  }, [dispatch]);

  return (
    <Router>
      <div className="">
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
      </div>
    </Router>
  );
}

export default App;
