import React from "react";

import Home from "./pages/Home";
import { FormDataContextProvider } from "./context/FormDataContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserData from "./components/UserData";

import "./index.css";

const App = () => {
  return (
    <div className="container">
      <FormDataContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:username" element={<Home />} />
            <Route path="/details" element={<UserData />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </FormDataContextProvider>
    </div>
  );
};

export default App;
