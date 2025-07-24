import { useState ,useEffect } from 'react';
import styles from './NewWorkout.module.css';

function NewWorkout({ isSaveWorkoutClicked, setIsSaveWorkoutClicked }) {

// ****************************** Retrieve User Info ****************************** //
    const username = JSON.parse(sessionStorage.getItem('user')).username; // get username from sessionStorage.
    const userId = sessionStorage.getItem('userId');
    
// ****************************** Workout Data ****************************** //
    const [workoutName, setWorkoutName] = useState('');
    const [workout, setWorkout] = useState(null);
    const [newExercise, setNewExercise] = useState({ exercise: '', reps: '', sets: '', rest: '' });
    const [isEditingWorkoutName, setIsEditingWorkoutName] = useState(false);
    const [isEditingRowIndex, setIsEditingRowIndex] = useState(null); // Store the index of the row being edited

//*** Functions ***//
    function saveWorkoutName(){
        if (workoutName)
        {
            setIsEditingWorkoutName(false); 
        }
        else 
        {
            alert("Workout must be named");
        } 
    }

    function editWorkoutName(){
        setIsEditingWorkoutName(true);
    }

    function createWorkoutTable() {
        if (workout === null)
        {
            const newWorkout = { rows: [] };
            setWorkout(newWorkout); 
        }
        else {
            alert("There is already a workout in creating process!"); // Prevent overwriting existing workout
        }
    }

    function deleteWorkoutTable() {
        setWorkout(null);
    }

    function addExerciseRow() {
        if (!workout) return; 

        const updatedWorkout = { 
            ...workout, // shallow copy of workout.
            rows: [...workout.rows, { ...newExercise, isEditable: true }]}; // Add a new row with editable state.

        setWorkout(updatedWorkout);
        setNewExercise({ exercise: '', reps: '', sets: '', rest: '' }); // Reset the new exercise state
    }

    function removeExercise(rowIndex) {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            const updatedWorkout = {
                ...workout,
                rows: workout.rows.filter((_,index) => index !== rowIndex)}; // Remove row at specified index
            
            setWorkout(updatedWorkout);
        }
    }

    function saveExercise(rowIndex) {
        const { exercise, reps, sets, rest } = workout.rows[rowIndex];

        // Only save if all fields are filled
        if (exercise && reps && sets && rest) {
            const updatedWorkout = {
                ...workout, 
                rows: workout.rows.map((row,i) => i === rowIndex ? {...row, isEditable: false} : row)}; // Update row to non-editable

            setWorkout(updatedWorkout);
            setIsEditingRowIndex(null); // Reset editing row index
        } else {
            alert('Please fill in all fields before saving.'); // Set validation alert message
        }
    }

    // Switch to edit mode for a specific row
    function editExercise(rowIndex) {
        setIsEditingRowIndex(rowIndex); // Set the index of the row to edit
    }

//*** connecting to the backend server an DB ***/
//*** functions ***/
    const handleSaveWorkout  = async (userId) => {

        if (!userId) {
            alert('User ID is not available. Cannot save workout.');
            return;
        }

        const workoutData = {
            workout_name: workoutName,
            exercises: workout ? workout.rows.map(row => ({
                exercise_name: row.exercise,
                reps_or_time: row.reps,
                sets: Number(row.sets),
                rest_time: row.rest,
            })) : [],
        };

        console.log("Saving workout for user:", username); // Use the username to save the workout

        try {
            const response = await fetch(`http://localhost:5000/api/${userId}/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (!response.ok)
            {
                throw new Error(`Failed to save workout: ${errorData.message || response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Workout saved', data);

            // Clear workout state
            setWorkout(null);
            setWorkoutName('');

        } catch (error) {
            console.log('Error saving workout: ', error);
            alert("There was an error saving your workout. Please try again.");

        } finally {
            setIsSaveWorkoutClicked(!isSaveWorkoutClicked); 
        }
    }

// ****************************** Return Section ****************************** //
    return (
        <>
            {workout && (
                    <div className={styles.workoutContainer}>
                        <div className = {styles.headerSection}>
                            <h2 className = {styles.workoutHeader}>Workout Name: </h2>
                            {isEditingWorkoutName ? (
                                <>
                                    <input value = {workoutName} type = "text" onChange={(e) => {setWorkoutName(e.target.value)}} ></input>
                                    <button className= {styles.saveExerciseBtn} onClick={saveWorkoutName}>✓</button>
                                </>
                                
                                ) : (
                                <>
                                    <span className = {styles.workoutName}>{workoutName}</span>
                                    <button className= {styles.editExerciseBtn} onClick={editWorkoutName}>✎</button>
                                </> 
                                )    
                            }

                        </div>

                        <table className={styles.workoutTable}>
                            <thead>
                                <tr>
                                    <th>Ex Name</th>
                                    <th>Reps/Time</th>
                                    <th>Sets</th>
                                    <th>Rest</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                            {workout.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {isEditingRowIndex === rowIndex ? (
                                        <>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    placeholder='Exercise' 
                                                    value={row.exercise} 
                                                    onChange={(e) => {
                                                        const updatedRow = { ...row, exercise: e.target.value };
                                                        const updatedWorkout = {
                                                            ...workout,
                                                            rows: workout.rows.map((r, index) => 
                                                                index === rowIndex ? updatedRow : r // Update only the row at rowIndex
                                                            )
                                                        };
                                                        setWorkout(updatedWorkout); // Update workouts state
                                                    }} 
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    placeholder='Reps/Time' 
                                                    value={row.reps} 
                                                    onChange={(e) => {
                                                        const updatedRow = { ...row, reps: e.target.value };
                                                        const updatedWorkout = {
                                                            ...workout,
                                                            rows: workout.rows.map((r, index) => 
                                                                index === rowIndex ? updatedRow : r // Update only the row at rowIndex
                                                            )
                                                        };
                                                        setWorkout(updatedWorkout); // Update workouts state
                                                    }} 
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    placeholder='Sets' 
                                                    value={row.sets} 
                                                    onChange={(e) => {
                                                        const updatedRow = { ...row, sets: e.target.value };
                                                        const updatedWorkout = {
                                                            ...workout,
                                                            rows: workout.rows.map((r, index) => 
                                                                index === rowIndex ? updatedRow : r // Update only the row at rowIndex
                                                            )
                                                        };
                                                        setWorkout(updatedWorkout); // Update workouts state
                                                    }} 
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    placeholder='Rest' 
                                                    value={row.rest} 
                                                    onChange={(e) => {
                                                        const updatedRow = { ...row, rest: e.target.value };
                                                        const updatedWorkout = {
                                                            ...workout,
                                                            rows: workout.rows.map((r, index) => 
                                                                index === rowIndex ? updatedRow : r // Update only the row at rowIndex
                                                            )
                                                        };
                                                        setWorkout(updatedWorkout); // Update workouts state
                                                    }} 
                                                />
                                            </td>
                                            <td>
                                                <button className= {styles.saveExerciseBtn} onClick={() => saveExercise(rowIndex)}>✓</button>
                                                <button className= {styles.removeExerciseBtn} onClick={() => removeExercise(rowIndex)}>X</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className = {styles.savedExerciseRowData}>{row.exercise}</td>
                                            <td className = {styles.savedExerciseRowData}>{row.reps}</td>
                                            <td className = {styles.savedExerciseRowData}>{row.sets}</td>
                                            <td className = {styles.savedExerciseRowData}>{row.rest}</td>
                                            <td>
                                                <button className = {styles.editExerciseBtn} onClick={() => editExercise(rowIndex)}>✎</button>
                                                <button className= {styles.removeExerciseBtn} onClick={() => removeExercise(rowIndex)}>X</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className = {styles.addSaveClose}>
                            <button className = {styles.addExerciseBtn} onClick={addExerciseRow}>Add Exercise</button>
                            <button className = {styles.saveWorkoutBtn} onClick={() => handleSaveWorkout(userId)}>Save Workout</button> 
                            <button className = {styles.closeWorkoutBtn} onClick ={deleteWorkoutTable}>Close Workout</button>
                        </div>
                        

                    </div> )}
    
            <div className={styles.createWorkoutContainer}>
                <button className={styles.createWorkoutBtn} onClick={createWorkoutTable}>+</button>
            </div>        
        </>
    );
}

export default NewWorkout;
