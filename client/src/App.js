//We use route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

import LoginScreen from "./screens/loginScreen/loginScreen";
import HomeScreen from "./screens/homeScreen/homeScreen";
import AnnouncementScreen from "./screens/announcementScreen/announcementScreen";
import MembersScreen from "./screens/membersScreen/membersScreen";
import AttendanceScreen from "./screens/attendanceScreen/attendanceScreen";
import Sidebar from "./components/Sidebar/Sidebar";
import './App.css'


function Layout({ children }) {
  const location = useLocation();

  // Check the current route and conditionally render Sidebar
  const shouldRenderSidebar = location.pathname !== '/';

  return (
    <div className="app-container">
      {shouldRenderSidebar && <Sidebar />}
      <div className="content-container">
        {children}
      </div>
    </div>
  );
}

function App() {
  
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<LoginScreen />}
        />
        <Route
          path="/home"
          element={<Layout><HomeScreen /></Layout>}
        />
        <Route
          path="/announcements"
          element={<Layout><AnnouncementScreen /></Layout>}
        />
        <Route
          path="/members"
          element={<Layout><MembersScreen /></Layout>}
        />
        <Route
          path="/attendance"
          element={<Layout><AttendanceScreen /></Layout>}
        />
      </Routes>
    </div>
  );
}

export default App;


