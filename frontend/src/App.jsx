import React from "react";
import { Routes, Route } from "react-router-dom";
import User from "./components/User";
import Admin from "./components/Admin";
import ChatInterface from "./components/ChatInterface";
import AdminView from "./components/AdminView";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatInterface />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/view-responses" element={<AdminView />} />
    </Routes>
  );
};

export default App;
