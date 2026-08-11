import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthModal } from "./context/AuthModalContext";
import MainLayout from "./layouts/MainLayout";
import ManagePage from "./pages/admin/ManagePage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import DetailPage from "./pages/public/DetailPage";
import HomePage from "./pages/public/HomePage";
import ListPage from "./pages/public/ListPage";

function ModalLauncher({ mode }: { mode: "login" | "register" | "forgot" }) {
  const { openLogin, openRegister, openForgot } = useAuthModal();
  useEffect(() => {
    if (mode === "login") openLogin("user");
    if (mode === "register") openRegister();
    if (mode === "forgot") openForgot();
  }, [mode, openForgot, openLogin, openRegister]);
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<ModalLauncher mode="login" />} />
      <Route path="/register" element={<ModalLauncher mode="register" />} />
      <Route path="/forgot-password" element={<ModalLauncher mode="forgot" />} />

      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="about" element={<AboutPage />} />
          <Route path="properties" element={<ListPage kind="properties" />} />
          <Route path="properties/:id" element={<DetailPage kind="properties" />} />
          <Route path="projects" element={<ListPage kind="projects" />} />
          <Route path="projects/:id" element={<DetailPage kind="projects" />} />
          <Route path="contact" element={<ContactPage />} />
          <Route element={<AdminRoute />}>
            <Route path="manage" element={<Navigate to="/manage/properties" replace />} />
            <Route path="manage/:resource" element={<ManagePage />} />
            <Route path="manage/:resource/:id" element={<ManagePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
