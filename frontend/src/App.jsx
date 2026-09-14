import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import DomainPage from "./pages/DomainPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import AddResource from "./pages/AddResource.jsx";
import Search from "./pages/Search.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domain/:slug" element={<DomainPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route
            path="/add-resource"
            element={
              <PrivateRoute>
                <AddResource />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
