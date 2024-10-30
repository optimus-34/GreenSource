import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import Signup from "./components/Signup";
import ConsumerDashboard from "./components/ConsumerDashboard";

function App() {
  return (
    <>
      <Provider store={store}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/consumer/*" element={<ConsumerDashboard />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
