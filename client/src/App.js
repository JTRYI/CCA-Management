
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginScreen from "./screens/loginScreen/loginScreen";
import HomeScreen from "./screens/homeScreen/homeScreen";
import AnnouncementScreen from "./screens/announcementScreen/announcementScreen";
import MembersScreen from "./screens/membersScreen/membersScreen";
import Sidebar from "./components/Sidebar/Sidebar";
import './App.css'
import Enable2FAScreen from "./screens/enable2FAScreen/enable2FAScreen";


function Layout({ children }) {

  const token = sessionStorage.getItem('token')
  const navigate = useNavigate();
  const [checkToken, setCheck] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function checkToken() {

      if (token != null) {
        //Sets checkToken to be true
        setCheck(true);
        return null;

      }
      else {
        
        return navigate("/");

      }
    }

    checkToken();
  }, [token, navigate]);


  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(`http://localhost:5050/user/${token}`);

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const userJSON = await response.json();
        sessionStorage.setItem('user', JSON.stringify(userJSON));
        setLoading(false); // Set loading to false once user data is fetched and set to the sessionStorage
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    //When checkToken is true, meaning token has been checked/available, only then, getUser function will be runned 
    if (checkToken) {
      getUser();
    }
  }, [checkToken]) //passing in checkToken as the dependency, allows this useEffect to run again when checkToken becomes true
  // when checkToken is false, getUser function will not run. Hence, we have to pass in checkToken as the dependency

  //code below prevents runtime error when user hasnt been stored in sessionStorage yet and Sidebar Component already wants to access user.
  //Only when it is set to false, will the layout component be returned
  if (loading) {
    return null;
  }

  return (
    <div className="app-container">
      {token && <Sidebar />}
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
          path="/enable2FA"
          element={<Layout><Enable2FAScreen/></Layout>}
        />
      </Routes>
    </div>
  );
}

export default App;


