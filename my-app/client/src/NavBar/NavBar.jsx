import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css'

function NavBar({showHome, showBuildProgram, showMyProgram, showExFinder, showLogin, showSignOut, setUser}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        navigate('/Home');
    };

  return (
        <nav className = {styles.NavBar}>
            <ul>
                {showHome && (<li onClick={() => navigate('/Home')}>Home</li>)}
                {showBuildProgram && (<li onClick={() => navigate('/Build_program')}>Build Program</li>)}
                {showMyProgram && (<li onClick={() => navigate('/My_program')}>My Program</li>)}
                {showExFinder && (<li onClick={() => navigate('/Ex_finder')}>Ex Finder</li>)}


            {/* Use a div for right-aligned items + they may be hidden */}
                <span>
                    {showLogin && (<li onClick={() => navigate('/Login')}>Log in</li>)}
                    {showSignOut && (<li onClick={handleLogout}>Sign Out</li>)}  
                </span>
            </ul>
        </nav>      
  );
}

export default NavBar