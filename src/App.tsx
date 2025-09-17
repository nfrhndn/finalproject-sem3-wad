import { Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
