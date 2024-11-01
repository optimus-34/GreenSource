// import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import Signup from "./components/Signup";
import ConsumerDashboard from "./components/ConsumerDashboard";
import FarmerDashboard from "./components/FarmerDashboard";
import ProductsPage from "./components/ProductsPage";
import CartPage from "./components/CartPage";
import ConsumerProfilePage from "./components/ConsumerProfilePage";

function App() {
  return (
    <>
      <Provider store={store}>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/consumer/products"
            element={
              <ConsumerDashboard>
                <ProductsPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/cart"
            element={
              <ConsumerDashboard>
                <CartPage />
              </ConsumerDashboard>
            }
          />
          <Route
            path="/consumer/profile"
            element={
              <ConsumerDashboard>
                <ConsumerProfilePage />
              </ConsumerDashboard>
            }
          />
          <Route path="/farmer" element={<FarmerDashboard />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
