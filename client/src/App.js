//We use route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";


import LoginScreen from "./components/loginScreen/loginScreen";

function App() {
  return (
    <div>
      <LoginScreen />
    </div>
  );
}

export default App;
