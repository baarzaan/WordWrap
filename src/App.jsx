import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/Routes";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./redux/actions/authActions";
import SideBar from "./components/common/SideBar";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="grid grid-cols-4 gap-4">
        <aside>
          <SideBar />
        </aside>
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
