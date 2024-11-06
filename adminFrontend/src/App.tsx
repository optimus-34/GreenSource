import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import AdminDashboard from "./components/AdminDashboard";
import AdminOverview from "./components/AdminOverview";

function App() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminDashboard>
                <AdminOverview />
              </AdminDashboard>
            }
          />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
