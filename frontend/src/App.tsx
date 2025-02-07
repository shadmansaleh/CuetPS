import { Role, ProtectedRoute } from "./components/ProtectedRoute";
import { useRoutes, Navigate } from "react-router-dom";
// import useDarkMode from "./hooks/useDarkMode";

// components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// pages
import LandingPage from "./pages/visitor/LandingPage";
import Login from "./pages/visitor/LoginPage";
import AboutUs from "./pages/visitor/AboutUsPage";
import ContactPage from "./pages/visitor/ContactPage";
import SignUp from "./pages/visitor/SignUpPage";
import ForgotPassword from "./pages/visitor/ForgotPasswordPage";
import ResetPassword from "./pages/visitor/ResetPasswordPage";
import NotFound404 from "./pages/Common/NotFound404";
import Exhibition from "./pages/visitor/ExhibitionPage";
import Gallery from "./pages/visitor/Gallery";
import ExhibitionDetails from "./pages/visitor/ExhibitionDetails";
import ExhibitionDetail from "./pages/Admin/ExhibitionDetail";
// import ExhibitionPhotos from "./pages/Admin/ExhibitionPhotos";
import Profile from "./pages/visitor/Profile";
import AdminPage from "./pages/Admin/AdminPage";
import { useAuth } from "./contexts/AuthContext";
import Loading from "./components/Loading";

function App() {
  // const [darkMode] = useDarkMode(); // No need to reset it
  const { loading: authLoading } = useAuth();

  const AppRoutes = useRoutes([
    {
      path: `${__BASE_URL__}/`,
      element: <ProtectedRoute role={Role.NOADMIN} />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "about", element: <AboutUs /> },
        { path: "gallery", element: <Gallery /> },
        { path: "exhibitions", element: <Exhibition /> },
        { path: "exhibitions/:id", element: <ExhibitionDetails /> },
        { path: "contact", element: <ContactPage /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password/:id/:token", element: <ResetPassword /> },
      ],
    },
    {
      path: `${__BASE_URL__}/`,
      element: <ProtectedRoute role={Role.NOAUTH} />,
      children: [
        { path: "login", element: <Login /> },
        { path: "signup", element: <SignUp /> },
      ],
    },
    {
      path: `${__BASE_URL__}/admin`,
      element: <ProtectedRoute role={Role.ADMIN} />,
      children: [
        { index: true, element: <AdminPage /> },
        { path: ":path", element: <AdminPage /> },
        { path: "exhibitions/:id", element: <ExhibitionDetail /> },
        // { path: "exhibitions/:id", element: <ExhibitionPhotos /> },
      ],
    },
    {
      path: `${__BASE_URL__}/`,
      element: <ProtectedRoute role={Role.AUTH} />,
      children: [
        { path: "profile", element: <Navigate to="/profile/me" replace /> }, // Redirect `/profile` to `/profile/me`
        { path: "profile/:id", element: <Profile /> }, // Profile with ID
      ],
    },
    { path: "*", element: <NotFound404 /> },
  ]);

  if (authLoading) return <Loading />;

  return (
    <div className="bg-base-100">
      <NavBar />
      {AppRoutes}
      <Footer />
    </div>
  );
}

export default App;
