import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { RootState } from "./store/rootReducer";

const App = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <LoginPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <HomePage /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <HomePage /> : <SignupPage />}
        />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
