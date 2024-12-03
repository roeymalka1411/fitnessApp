import styles from './WorkoutsNamesList.module.css';
import { useState, useEffect } from 'react';

function WorkoutsNamesList({ data, setData }) {
    const username = JSON.parse(sessionStorage.getItem('user'))?.username;
    console.log('Username:', username);

    const [userId, setUserId] = useState(null);

    //*** fetching user Id ***//
    useEffect(() => {
        const fetchUserId = async () => {
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
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserId();
    }, [username]);

    //*** fetching user workouts  ***/
    useEffect(() => {
        if (!userId) return; // Check if userId is available
        const fetchUserWorkouts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/${userId}/workouts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to get user workouts: ${errorData.message}`);
                }

                const workoutsData = await response.json();
                console.log(`${username} Workouts retrieved`);
                const workoutNames = workoutsData.workouts.map(workout => workout.workout_name);

                // Set the fetched workouts in the parent component’s state
                setData(workoutNames);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserWorkouts();
    }, [userId, username, setData]);

    //*** handler to start dragging ***/
    const handleDragStart = (event, workoutName) => {
        event.dataTransfer.setData("text/plain", workoutName);
    };

    //*** return section  ***/
    return (
        <div className={styles.workoutsList}>
            <h1 className={styles.header}>Plan Your Workouts</h1>
            <p className={styles.headerElaboration}>
                The "Plan Your Workouts" feature lets users drag workouts from the "Available Workouts" list to the calendar, highlighting the available date slots. Once dropped, a confirmation message appears, confirming the workout is scheduled. Users can also double-click on a scheduled workout to remove it, making the planning process intuitive and efficient.
            </p>

            <h1 className={styles.header}>Workouts list</h1>
            <ul className={styles.list}>
                {data.map((name, index) => (
                    <li
                        key={index}
                        draggable
                        onDragStart={(event) => handleDragStart(event, name)}
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkoutsNamesList;
