import styles from './Login.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 


function Login({setUser})    
{

//*** variables ***/
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

//*** functions ***/
    const handleUserSubmition = async(e) => {
        e.preventDefault();

        const userData = {username, password};

        try {

            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
              });
          

            if (!response.ok)
            {
                // Clear the password before throwing the error
                setPassword(''); 
                document.querySelector('input[type="password"]').value = ''; // Ensure manual clear of the input box

                throw new Error("Invalid login credentials");
            }

            // console log if the process succeeded
            const data = await response.json(); // in order to use "username" property the response (the success massage) at the path definition must contain this property.
            console.log("Login successful", data);

            // store user data in a session storage
            sessionStorage.setItem('user', JSON.stringify({username: data.username}))

            // using the prop setUser:
            setUser({username: data.username});

            // Clear password and username
            setPassword('');
            setUsername('');

            // Fetch user ID after successful login
            await fetchUserId(data.username);

            // Slight delay before navigation to ensure state is cleared
            navigate('/Home');

        } catch(error) {
            console.log('Error login: ', error);
            alert("There was an issue with user login. Please try again.");
        }  
    }

// setting userId as a session item right after connection:
    //*** fetching user Id ***//
    const fetchUserId = async (username) => {
        if (!username) return; // Check if username is available
        try {
            const response = await fetch(`http://localhost:5000/api/users/get/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to get userId: ${errorData.message}`);
            }

            const data = await response.json();
            console.log('UserId retrieved', data.userId);
            setUserId(data.userId);
            sessionStorage.setItem('userId', data.userId); // Set userId in session storage here
            
        } catch (error) {
            console.error(error);
        }
    }


//*** return section ***/
    return (
        <div className = {styles.wrapper}>
        <form onSubmit={handleUserSubmition}>
            <h1>Login</h1>
            <div className = {styles.inputBox} >
                <input type = "text" placeholder = "Username" value = {username} onChange = {(e) => setUsername(e.target.value)} required />
            </div>
            <div className = {styles.inputBox} >
                <input type = "password" placeholder = "Password" value = {password} onChange = {(e) => setPassword(e.target.value)} autoComplete="off" required />
            </div>
            <div className = {styles.remember_forgot}>
                <p><input type = "checkbox" />Remember me</p> {/* need to understand how to save the cardinals on google. */}
                <a href = "#">Forgot password?</a> {/* need to understand how to set it need to understand hoo to verify inside gmail.*/}
            </div>

            <button type = "submit" className = {styles.LoginBtn}>Login</button>

            <div className = {styles.register_link}>
                <p>Don't have an acount? <a href = "#" onClick={() => navigate('/Sign_up')}>Register</a></p>
            </div>

        </form>
    </div>
    );
}

export default Login;

{/* after filling the details i want to retrun to home page
    in addition write a sign that i am logged in*/}
