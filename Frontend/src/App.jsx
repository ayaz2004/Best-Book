import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import AdminBookDashboard from "./pages/AdminBookDashboard";
import AdminQuizDashboard from "./pages/AdminQuizDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import BookDetails from "./pages/BookDetails";
import AllBooks from "./pages/AllBooks";
import UserAnalytics from "./components/UserAnalytics";
import CartPage from "./pages/CartPage";
import VerifyOTP from "./pages/VerifyOTP";
import CheckoutPage from "./pages/CheckoutPage";
import Orders from "./pages/Orders";
import AdminOrderDashboard from "./pages/AdminOrderDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/book/:bookId" element={<BookDetails />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* <Route path="/admin-dashboard" element={<TempDashBoard />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/manage-books" element={<AdminBookDashboard />} />
          <Route path="/manage-quiz" element={<AdminQuizDashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/manage-user" element={<UserAnalytics />} />
          <Route path="/manage-order" element={<AdminOrderDashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
