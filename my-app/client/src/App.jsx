import { BrowserRouter as Router, Routes, Route,useLocation } from 'react-router-dom';
import {useState, useEffect} from 'react';
import Home from './pages/Home_page/Home.jsx';
import Build_program from './pages/Build_program_page/Build_program.jsx';
import My_program from './pages/My_program_page/My_program.jsx';
import Ex_finder from './pages/Ex_finder_page/Ex_finder.jsx';
import NavBar from './NavBar/NavBar.jsx';
import Login from './pages/Login_page/Login.jsx';
import Sign_up from './pages/Sign_up_page/Sign_up.jsx';

function App() {

  const location = useLocation();
  const [user, setUser] = useState(null); // global user state that will be passed as prop.

  // check if user is already logged in session storage (relies on the login.jsx component):
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser)
    {
      setUser(JSON.parse(sessionUser)); // Load the user from sessionStorage
    }
  }, [])

  // used to show the NavBar components depends on the user's status:
  const showNavBarOptions = {
    showHome: true,
    showBuildProgram: !!user, // example, if there is user showBuildProgram will be true.
    showMyProgram: !!user,
    showExFinder: !!user,
    showLogin: !user, // example, if there isn't user showLogin will be true.
    showSignOut: !!user,
  };

  return (
    <>
      <NavBar {...showNavBarOptions} setUser = {setUser} /> {/* props */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Build_program" element={<Build_program />} />
        <Route path="/My_program" element={<My_program />} />
        <Route path="/Ex_finder" element={<Ex_finder />} />
        <Route path="/Login" element={<Login setUser = {setUser} />} />
        <Route path="/Sign_up" element={<Sign_up />} />
      </Routes>
    </>
  );
}

export default function MainApp(){
  return (
    <Router>
      <App/>
    </Router>
  );
}