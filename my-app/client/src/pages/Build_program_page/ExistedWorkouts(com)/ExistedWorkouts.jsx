import { useState, useEffect, useRef } from 'react';
import styles from './ExistedWorkouts.module.css';
import NewWorkout from '../NewWorkout(com)/NewWorkout.jsx'

function ExistedWorkouts() {
    // ****************************** Retrieve User Info ****************************** //
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('user');
    const [isSaveWorkoutClicked, setIsSaveWorkoutClicked] = useState(false);

    // ****************************** Retrieve Workouts Info ****************************** //
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const fetchWorkouts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/${userId}/workouts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(response.message);
            }

            const data = await response.json();
            console.log("workouts: ", data);
            setWorkouts(data.workouts);

        } catch (error) {
            console.error("error message: ", error);

        } finally {
            setIsLoading(false); // neccesary, because return frontend section executed before the data is fetched.
        }
    };

    useEffect(() => { fetchWorkouts(); }, [isSaveWorkoutClicked])

    // ****************************** Workouts variables and functions section ****************************** //
    const [workoutName, setWorkoutName] = useState('');
    const [isEditingWorkoutId, setIsEditingWorkoutId] = useState(null)

    function editWorkoutName(workout) {
        setIsEditingWorkoutId(workout._id);
        setWorkoutName(workout.workout_name);
    }

    function saveWorkoutName(workoutId) {

        if (workoutName.trim() === '') {
            alert('Workout name field cannot be empty');
            return;
        }

        setWorkouts(prevWorkouts =>
            prevWorkouts.map(w => w._id === workoutId ? { ...w, workout_name: workoutName } : w)
        );
        setIsEditingWorkoutId(null);
        setWorkoutName('');
    }

    // ****************************** Exercises variables and functions section ****************************** //
    const [IsEditingExerciseId, setIsEditingExerciseId] = useState(null);

    function editExercise(exerciseId) {
        setIsEditingExerciseId(exerciseId); // Set the ID of the exercise being edited
    }

    function saveExercise(exerciseId, workoutId) {
        const workout = workouts.find(w => w._id === workoutId);
        const exercise = workout.exercises.find(ex => ex._id === exerciseId);

        if (!exercise.exercise_name || !exercise.reps_or_time || !exercise.sets || !exercise.rest_time) {
            alert('Please fill all the fields');
            return;
        }

        setIsEditingExerciseId(null);
    };

    function handleExerciseChange(workoutId, exerciseId, field, value) {
        if (field === 'sets') {
            value = Number(value); // Convert sets to a number
        }

        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout._id === workoutId
                    ? {
                        ...workout,
                        exercises: workout.exercises.map((exercise) =>
                            exercise._id === exerciseId
                                ? { ...exercise, [field]: value } // Update the specific field
                                : exercise
                        ),
                    }
                    : workout
            )
        );
    }

    function removeExercise(workoutId, exerciseId) {
        if (window.confirm('Are you sure you want to remove this exercise?')) {
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout._id === workoutId
                    ? { ...workout, exercises: workout.exercises.filter((ex) => ex._id !== exerciseId) }
                    : workout
            )
        );
    }}

    function addExerciseRowBtn(workoutId) {
        const newExerciseRow = {
            exercise_name: '',
            reps_or_time: '',
            sets: '',
            rest_time: '',
        };
    
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout._id === workoutId
                    ? { ...workout, exercises: [...workout.exercises, newExerciseRow] }
                    : workout
            )
        );
    }

    // ****************************** save and delete workout buttons from the db section ****************************** //
    async function saveWorkout(workoutId) {
        const workout = workouts.find(w => w._id === workoutId.toString());
        if (!workout) {
            console.error("Workout not found");
            return;
        }

        // sending an alert if one of the exercises is empty
        for (let exercise of workout.exercises) {
            if (!exercise.exercise_name || !exercise.reps_or_time || !exercise.sets || !exercise.rest_time) {
                alert('Cannot save workout. Please fill all the exercise fields.');
                return;
            }
        }

        // sending an alert if one of the exercises is in edit
        if (isEditingWorkoutId || IsEditingExerciseId)
        {
            alert('Cannot save the workout when one of the fields is in edit process.');
            return;   
        }
    
        const reqBody = {
            workout_name: workout.workout_name, // Ensure you're using the updated workout name
            exercises: workout.exercises,  // MongoDB will handle the _id for exercises
        };
    
        try {
            const response = await fetch(`http://localhost:5000/api/${userId}/workouts/${workoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            });
    
            if (!response.ok) {
                throw new Error(response.message);
            }
    
            // Accessing the workout object from the response and updating the state
            const updatedWorkout = await response.json();
            setWorkouts(prevWorkouts =>
                prevWorkouts.map(w => w._id === workoutId ? updatedWorkout.workout : w)
            );
    
            console.log("workout updated", updatedWorkout);
            alert('workout successfully saved.');
    
        } catch (error) {
            console.error('Error: ', error);

        } finally {
            setIsSaveWorkoutClicked(!isSaveWorkoutClicked);
        }
    }

    async function deleteWorkout(workoutId) {
        if (window.confirm('Are you sure you want to delete this workout?')){
            const workout = workouts.find(w => w._id === workoutId.toString());
            if (!workout) {
                console.error("Workout not found");
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:5000/api/${userId}/workouts/${workoutId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error(response.message);
                }
    
                // updating the local state:
                setWorkouts(prevWorkouts =>
                    prevWorkouts.filter(w => w._id !== workoutId)
                );
    
            } catch (error) {
                console.error('Error: ', error);
            }
        }
    }

    // ****************************** Return section: Workouts tables ****************************** //
    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h1 className={styles.header}>My Workouts</h1>
                    <div className={styles.workoutsContainer}>
                        {workouts.length > 0 && (
                            workouts.map((workout) => (
                                <div key={workout._id} className={styles.workoutSection}>
                                    <div className={styles.headerSection}>
                                        <h2 className={styles.workoutHeader}>Workout Name:</h2>
                                        {isEditingWorkoutId === workout._id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={workoutName}
                                                    placeholder='Workout Name'
                                                    onChange={(e) => setWorkoutName(e.target.value)}
                                                />
                                                <button className={styles.saveExerciseBtn} onClick={() => saveWorkoutName(workout._id)}>✓</button>
                                            </>
                                        ) : (
                                            <>
                                                <span className={styles.workoutName}>{workout.workout_name}</span>
                                                <button className={styles.editExerciseBtn} onClick={() => editWorkoutName(workout)}>✎</button>
                                            </>
                                        )}
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
                                            {workout.exercises.map((exercise) => (
                                                <tr key={exercise._id}>
                                                    {IsEditingExerciseId === exercise._id ? (
                                                        <>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={exercise.exercise_name}
                                                                    placeholder='Exercise'
                                                                    onChange={(e) => handleExerciseChange(
                                                                        workout._id,
                                                                        exercise._id,
                                                                        'exercise_name',
                                                                        e.target.value
                                                                    )}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={exercise.reps_or_time}
                                                                    placeholder='reps_or_time'
                                                                    onChange={(e) => handleExerciseChange(
                                                                        workout._id,
                                                                        exercise._id,
                                                                        'reps_or_time',
                                                                        e.target.value
                                                                    )}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={exercise.sets}
                                                                    placeholder='sets'
                                                                    onChange={(e) => handleExerciseChange(
                                                                        workout._id,
                                                                        exercise._id,
                                                                        'sets',
                                                                        e.target.value
                                                                    )}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={exercise.rest_time}
                                                                    placeholder='rest_time'
                                                                    onChange={(e) => handleExerciseChange(
                                                                        workout._id,
                                                                        exercise._id,
                                                                        'rest_time',
                                                                        e.target.value
                                                                    )}
                                                                />
                                                            </td>
                                                            <td>
                                                                <button className= {styles.saveExerciseBtn} onClick={() => saveExercise(exercise._id, workout._id)}>✓</button>
                                                                <button className= {styles.removeExerciseBtn} onClick={() => removeExercise(workout._id, exercise._id)}>X</button>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className = {styles.savedExerciseRowData} >{exercise.exercise_name}</td>
                                                            <td className = {styles.savedExerciseRowData} >{exercise.reps_or_time}</td>
                                                            <td className = {styles.savedExerciseRowData} >{exercise.sets}</td>
                                                            <td className = {styles.savedExerciseRowData} >{exercise.rest_time}</td>
                                                            <td>
                                                                <button className= {styles.editExerciseBtn} onClick={() => editExercise(exercise._id)}>✎</button>
                                                                <button className= {styles.removeExerciseBtn} onClick={() => removeExercise(workout._id, exercise._id)}>X</button>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className={styles.addSaveDeleteDiv}>
                                        <button className = {styles.addExerciseBtn} onClick={() => addExerciseRowBtn(workout._id)}>Add Exercise</button>
                                        <button className = {styles.saveWorkoutBtn} onClick={() => saveWorkout(workout._id)}>Save Workout</button>
                                        <button className = {styles.deleteWorkoutBtn} onClick={() => deleteWorkout(workout._id)}>Delete Workout</button>
                                    </div>
                                </div>
                            ))
                        )}

                        <NewWorkout
                            isSaveWorkoutClicked={isSaveWorkoutClicked} 
                            setIsSaveWorkoutClicked={setIsSaveWorkoutClicked} 
                        />
                    </div>
                </>
            )}
        </>
    );
}

export default ExistedWorkouts;
