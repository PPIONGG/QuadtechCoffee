import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./components/Users";
import Admin from "./components/Admin";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/Admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
