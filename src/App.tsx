import React from "react";
import ProfileCard from "./components/ProfileCard";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ProfileCard />
    </div>
  );
};

export default App;
