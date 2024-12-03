const express = require('express');
const router = express.Router();
const User = require('../models/User');

/*============= post: setting new workout day in the calendar document of user db: =============*/
router.post('/:userId/updateCalendar', async (req, res) => {
    const {userId} = req.params; // req params are precede with ":", in this case userId
    const {date, workout_name} = req.body;

    try {
        const user = await User.findById(userId); 
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        // Convert the date to a standard format for comparison
        const workoutDate = new Date(date).toISOString().split('T')[0]; // Get only the date part (YYYY-MM-DD)

        // Check if a workout already exists for the given date
        const existingWorkout = user.calendar.find(workout => {
            return new Date(workout.date).toISOString().split('T')[0] === workoutDate;
        });

        if (existingWorkout) {
            return res.status(400).json({ message: 'A workout is already scheduled for this date.' });
        }
        
        const newWorkoutDay = {
            workout_name,
            date: new Date(date),
        };

        user.calendar.push(newWorkoutDay);
        await user.save();

        res.status(201).json({message: ' workout scheduled successfully', calendar: user.calendar});

    } catch (error) {
        res.status(500).json({ message: 'Error scheduling workout', error });
    }
});

/*============= get: get workout day from calendar document of  user db: (useful when reloading my_program.jsx page) =============*/
router.get('/:userId/ShowCalendar', async (req, res) => {
    const {userId} = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'}); 
        }
        res.status(200).json({calendar: user.calendar}); // success: connecting the client with its workouts in the backend.  

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving calendar', error });
    }
});

/*============= delete: delete workout day from calendar document of  user db: =============*/
router.delete('/:userId/scheduledDays/:scheduledDayDate', async (req, res) => {
    const { userId, scheduledDayDate } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Parse the scheduled day date
        const dateToDelete = new Date(scheduledDayDate);
        const scheduledDayIndex = user.calendar.findIndex(scheduledDay => {
            return scheduledDay.date.toISOString().split('T')[0] === dateToDelete.toISOString().split('T')[0];
        });

        if (scheduledDayIndex === -1) {
            return res.status(404).json({ message: 'Scheduled day not found' });
        }

        user.calendar.splice(scheduledDayIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Scheduled day deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting scheduled day', error });
    }
});

/*============= Exporting router =============*/
module.exports = router;