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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* <Route path="/admin-dashboard" element={<TempDashBoard />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/book/:bookId" element={<BookDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/manage-books" element={<AdminBookDashboard />} />
          <Route path="/manage-quiz" element={<AdminQuizDashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
