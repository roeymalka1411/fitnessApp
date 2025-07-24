import styles from './Sign_up.module.css';
import { useRef } from 'react';
import {useNavigate} from 'react-router-dom'

function Sign_up() {
/*** frontend part ***/
    const usernameRef = useRef(null); // i will set reference inside the html element.
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    function enableInvalidAlert(inputTypeRef, errorMessage){
        const inputBox = inputTypeRef.current; 
        const error = inputBox.nextElementSibling;

        inputBox.classList.add(styles.invalidAlert);
        error.textContent = errorMessage; // the error already has a class, just need to show it.
    }

    function disableInvalidAlert(inputTypeRef){
        const inputBox = inputTypeRef.current; 
        const error = inputBox.nextElementSibling;
        
        inputBox.classList.remove(styles.invalidAlert);
        error.textContent = "";
    }

    function emailValidation(email) {
        const rgExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // gmail format.
        return rgExp.test(email);
    }

    function ValidateSignUp() {
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
    
        // Clear existing error messages
        disableInvalidAlert(usernameRef);
        disableInvalidAlert(emailRef);
        disableInvalidAlert(passwordRef);
        disableInvalidAlert(confirmPasswordRef);
    
        if (username.length < 8) {
            const errorMessage = "Username must contain at least 8 characters.";
            enableInvalidAlert(usernameRef, errorMessage);
            return false;
        }
    
        if (!emailValidation(email)) {
            const errorMessage = "Invalid email format.";
            enableInvalidAlert(emailRef, errorMessage);
            return false;
        }
    
        if (password.length < 8) {
            const errorMessage = "Password must contain at least 8 characters.";
            enableInvalidAlert(passwordRef, errorMessage);
            return false;
        }
    
        if (password !== confirmPassword) {
            const errorMessage = "Passwords don't match.";
            enableInvalidAlert(confirmPasswordRef, errorMessage);
            return false;
        }
    
        return true; // All validations passed
    }
    

/*** verifying in the backend ***/
/*** variables ***/
const navigate = useNavigate();

//*** functions ***/
const verifyingNewUser = async (e) => {
    e.preventDefault();

    // Clear all frontend validation errors first
    disableInvalidAlert(usernameRef);
    disableInvalidAlert(emailRef);
    disableInvalidAlert(passwordRef);
    disableInvalidAlert(confirmPasswordRef);

    // Perform frontend validation and stop if invalid
    if (!ValidateSignUp()) {
        return; // Prevent backend call if frontend validation fails
    }

    const userData = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
    };

    try {
        const response = await fetch('http://localhost:5000/api/users/register', {   
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Get the error message from the backend
            alert(errorData.message); // Show the backend message (e.g., "User already exists")
            throw new Error(errorData.message || "Error during registration");
        }

        const data = await response.json();
        console.log("New user registered", data);

        // Slight delay before navigation to ensure state is cleared
        setTimeout(() => navigate('/Home'), 100);

    } catch (error) {
        console.error('Error in user registration: ', error);
        alert("There was an issue with user registration. Please try again.");
    }
};

    return (
        <div className={styles.wrapper}>
            <form id="form" onSubmit={verifyingNewUser}>
                <h1>Register</h1>

                <div className={styles.inputBox}>
                    <input
                        type="text"
                        className={styles.username}
                        placeholder="Username"
                        required
                        ref={usernameRef} // Attach ref
                    />
                    <div className={styles.error}></div>
                </div>

                <div className={styles.inputBox}>
                    <input
                        type="text"
                        className={styles.email}
                        placeholder="Email"
                        required
                        ref={emailRef} // Attach ref
                    />
                    <div className={styles.error}></div>
                </div>

                <div className={styles.inputBox}>
                    <input
                        type="password"
                        className={styles.password}
                        placeholder="Password"
                        required
                        ref={passwordRef} // Attach ref
                    />
                    <div className={styles.error}></div>
                </div>

                <div className={styles.inputBox}>
                    <input
                        type="password"
                        className={styles.confirmPassword}
                        placeholder="Confirm Password"
                        required
                        ref={confirmPasswordRef} // Attach ref
                    />
                    <div className={styles.error}></div>
                </div>

                <button type="submit" className={styles.signUpBtn}>Sign Up</button>
            </form>
        </div>
    );
}

export default Sign_up;
