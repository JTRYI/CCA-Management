//We use route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";


import LoginScreen from "./screens/loginScreen/loginScreen";
import HomeScreen from "./screens/homeScreen/homeScreen";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
      </Routes>
    </div>
  );
}

export default App;
