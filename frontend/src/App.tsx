// import Navbar from "./components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import { useSelector } from "react-redux";
import { selectAuth } from "./store/slices/authSlice";
import Signup from "./components/Signup";
import ConsumerDashboard from "./components/ConsumerDashboard";
import FarmerDashboard from "./components/FarmerDashboard";

function App() {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();

  if (!user.name) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Provider store={store}>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/consumer/*" element={<ConsumerDashboard />} />
          <Route path="/farmer/*" element={<FarmerDashboard />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
