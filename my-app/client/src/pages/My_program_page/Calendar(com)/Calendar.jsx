import React, { useState, useEffect} from 'react';
import styles from './Calendar.module.css';
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from 'react-icons/fa';

function Calendar() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // State to track the current month and year
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [calendarData, setCalendarData] = useState({});
    const userId = sessionStorage.getItem('userId');

    // Check if the year is a leap year:
    const isLeapYear = (year) => {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    };

//******************** Calendar header buttons ********************//
    // handler for "previous Month" button
    const handlePrevClick= () => {
        if(currentMonthIndex === 0)
        {
            setCurrentMonthIndex(11);
            setCurrentYear(currentYear - 1);    
        }
        else
        {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    // handler for "next Month" button
    const handleNextClick= () => {
        if(currentMonthIndex === 11)
        {
            setCurrentMonthIndex(0);
            setCurrentYear(currentYear + 1);    
        }
        else
        {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    // handler for "previous Month" button
    const handleTodayClick= () => {
        const today = new Date();
        setCurrentMonthIndex(today.getMonth());
        setCurrentYear(today.getFullYear());  
    };

    // days in month considering 29 february, function:
    const currentDaysInMonth = isLeapYear(currentYear) && currentMonthIndex === 1 ? 29 : daysInMonth[currentMonthIndex];

//******************** Dropping workout in the calendar ********************//
const handleDrop = async (event, day) => {
    event.preventDefault();
    const workoutName = event.dataTransfer.getData("text/plain");
    const fullDate = new Date(currentYear, currentMonthIndex, day);
    const dateKey = `${currentYear}-${currentMonthIndex + 1}-${day}`;

    if (calendarData[dateKey]) {
        alert('A workout is already scheduled for this day.');
        return;
    }

    try {
        const saved = await saveWorkout(workoutName, fullDate);
        if (saved) {
            setCalendarData(prev => ({
                ...prev,
                [dateKey]: {
                    name: workoutName,
                    style: {
                        backgroundColor: "black",
                        opacity: 0.8,
                    }
                }
            }));
            fetchCalendarData(); // Refetch calendar data to ensure UI is up-to-date
        }
    } catch (error) {
        console.error('Error saving workout:', error.message);
    }
};

//******************** Save workout and update calendar at the backend ********************//
    const saveWorkout = async (workoutName, date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const workoutData = {
            workout_name: workoutName,
            date: utcDate.toISOString() // Send the Date object directly
        };

        try {
            const response = await fetch(`http://localhost:5000/api/calendar/${userId}/updateCalendar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });
    
            if (!response.ok) {
                throw new Error(response.message);
            }

            const data = await response.json();
            console.log(data); // Handle the response data

            return true; // if managed to save the workout.        

        } catch (error)
        {
            console.error(error);
            alert('Error saving workout: ' + error.message); // Show error to the user 
        }
    };

    // Get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    }

//******************** Load calendar from the backend ********************//
const fetchCalendarData = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/calendar/${userId}/showCalendar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(response.message);
        }

        const data = await response.json(); // Parse response as JSON
        console.log(data);

        if (!data.calendar) { // Check if calendar data is present
            console.error("Calendar data is missing in the response");
            return;
        }

        const calendarState = {};

        data.calendar.forEach(workout => {
            const dateKey = workout.date.split('T')[0];
            calendarState[dateKey] = {
                name: workout.workout_name,
                style: { backgroundColor: 'black', opacity: 0.8 },
            };
        });

        setCalendarData(calendarState);

    } catch (error) {
        console.error('Error fetching calendar data: ', error);
    }
};

useEffect(() => {
    fetchCalendarData();
}, []);

//******************** Delete Scheduled Workout Day Section ********************//
// handle double click action
function handleDeleteAction(event, day) {
    const dateKey = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (calendarData[dateKey]) {
        deleteScheduledDay(day); // Call delete function only if there's a workout on that day
    }
    else {
        alert('No workout scheduled on this day.'); // Inform user there's no workout to delete
        return;
    }
}

//  delete scheduled workout day from beckend
const deleteScheduledDay = async (day) => {
    const fullDate = new Date(currentYear, currentMonthIndex, day);
    const utcDate = new Date(Date.UTC(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate()));
    const dateKey = utcDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

    try {
        const response = await fetch(`http://localhost:5000/api/calendar/${userId}/scheduledDays/${dateKey}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error: ' + response.message);
        }

        const data = await response.json();
        console.log('Deletion response:', data);

        // Remove the workout from the calendar state
        setCalendarData(prev => {
            const newCalendarData = { ...prev };
            delete newCalendarData[dateKey]; // Remove the deleted workout
            return newCalendarData;
        });

    } catch (error) {
        console.error('Error deleting scheduled workout:', error);
    }
};

//******************** Display Days Grid Section ********************//
    // display Days function:
    const displayDays = () => {
        const weekDays = Array.from({ length: 7}, (_, index) => days[index]);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex);

        return(
            <ul className = {styles.daysGrid}>
            {/* week days row */}
            {weekDays.map((day, index) => (<li className = {styles.weekDays} key = {index}>{day}</li>))}

            {/* Empty cells before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <li className = {styles.emptyCells} key={`empty-${index}`} />
                ))}

            {/* Fill in the days of the month */}
                {Array.from({ length: currentDaysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const key = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const workout = calendarData[key];

                    return (
                        <li
                            key={key}
                            className={styles.actualDays}
                            style={workout ? workout.style : {}}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => handleDrop(event, day)}
                            onDoubleClick={(event) => handleDeleteAction(event,day)}
                        >
                            <span className={styles.dayNumber}>{day}</span>
                            {workout ? (
                                <div className={styles.workoutName}>{workout.name}</div>
                            ) : (
                                <div></div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

//******************** Return Section ********************//
    return (
        <>
            <h1 className={styles.mainHeader}>Program Calendar</h1>
            <div className={styles.container}>
                <div className={styles.calendar}>

                    {/* Calendar header */}
                    <div className={styles.header}>

                        {/* Display current month and year */}
                        <div className={styles.month}>{`${months[currentMonthIndex]}, ${currentYear}`}</div>
                        
                        {/* Icons for navigating the calendar */}
                        <div className={styles.btns}>

                            {/* Calendar icon for "Today" */}
                            <button onClick = {handleTodayClick} className={styles.btnToday}>
                                <FaRegCalendarAlt size={30} />
                            </button>
                            {/* Previous button */}
                            <button onClick = {handlePrevClick} className={styles.btnPrev}>
                                <FaChevronLeft size={30} />
                            </button>
                            {/* Next button */}
                            <button onClick = {handleNextClick} className={styles.btnNext}>
                                <FaChevronRight size={30} />
                            </button>

                        </div>
                    </div>

                    {/* Days grid */}
                    {displayDays()}

                </div>
            </div>
        </>
    );
}

export default Calendar;
