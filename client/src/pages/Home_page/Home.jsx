import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
            <div className={styles.leftSide}>
                <div className={styles.firstSection}>
                    <p className={styles.firstLine}><span>My Fitness</span> App</p>
                    <p className={styles.secondLine}>Create personalized workout programs, explore a vast exercise library, and track your fitness progress effortlessly. Your journey to a healthier lifestyle starts here!</p>
                </div>    
                <div className={styles.secondSection}>
                    <p className={styles.thirdLine}>Want to get in shape?</p>
                    <button onClick={() => navigate('/Sign_up')} className={styles.registerBtn}>Register here</button>
                </div>
            </div>
    );
}

export default Home;
