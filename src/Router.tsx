import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Admin from "./pages/login/Admin";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
