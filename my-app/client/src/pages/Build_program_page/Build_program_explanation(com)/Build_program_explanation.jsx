import styles from './Build_program_explanation.module.css';

function Build_program_explanation() {

// ****************************** Retrieve User Info ****************************** //
    const username = JSON.parse(sessionStorage.getItem('user')).username; // get username from sessionStorage.
    const userId = sessionStorage.getItem('userId');
    
// ****************************** Return Section ****************************** //
    return (
        <div className = {styles.pageContainer}>
            <div className = {styles.leftSide}>
                <h1 className = {styles.header}>Plan Your Workout Routine</h1>
                <p className = {styles.headerElaboration}>Use this tool to design a workout plan that fits your fitness goals. Choose exercises, set reps and sets, and structure your workout to match your preferences and skill level.</p>
            </div>

            <div className = {styles.rightSide}>
                <div className={styles.GuidelineContainer}>
                    <h2>Workout Creation Guidelines</h2>
                    <ul>
                        <li><span>Create one workout at a time:</span> Sav your current workout to start a new one.</li>
                        <li><span>Unsaved Changes:</span> Press the close button to discard unsaved workouts and start fresh.</li>
                        <li><span>Required Fields:</span> Fill in all data fields in each row before saving or editing.</li>
                        <li><span>Editing Exercises:</span> You can edit and remove exercises as needed.</li>
                        <li><span>Add Exercises:</span> Click "Add Exercise" to include more exercises in your workout.</li>
                        <li><span>Save Your Workout:</span> Press "Save Workout" to keep your progress.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Build_program_explanation;
