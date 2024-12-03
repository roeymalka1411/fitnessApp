const express = require('express');
const router = express.Router();
const User = require('../models/User');

/*============= post: setting new workout in the user db: =============*/
router.post('/:userId/workouts', async (req, res) => {
    const {userId} = req.params; // req params are precede with ":", in this case userId
    const {workout_name, exercises} = req.body;

    try {
        const user = await User.findById(userId); 
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        const newWorkout = {workout_name, exercises};

        user.workouts.push(newWorkout);
        await user.save();

        res.status(201).json({message: 'Workout added successfully' ,workout: newWorkout});
    } catch (error) {
        res.status(500).json({ message: 'Error adding workout', error });
    }
});

/*============= get: retrieve user's whole workouts from db: =============*/
router.get('/:userId/workouts', async (req, res) => {
    const {userId} = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'}); 
        }
        res.status(200).json({workouts: user.workouts}); // success: connecting the client with its workouts in the backend.        
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workouts', error });
    }
});

/*============= put: update user's workout =============*/
router.put('/:userId/workouts/:workoutId', async (req, res) => {
    const {userId, workoutId} = req.params;
    const {workout_name, exercises} = req.body;

    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'}); 
        }
        
        const workout = user.workouts.find(workout => workout._id.toString() === workoutId); // findById method not suited for arrays.
        if (!workout)
        {
            return res.status(404).json({message: 'Workout not found'}); 
        }
    
        workout.workout_name = workout_name;
        workout.exercises = exercises;
    
        await user.save();
        res.status(200).json({message: 'workout updated successfully', workout});
    } catch (error) {
        res.status(500).json({message: 'Error updating workout', error});
    }
});

/*============= delete: delete user's workout from its db =============*/
router.delete('/:userId/workouts/:workoutId', async (req, res) => {
    const {userId, workoutId} = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'}); 
        }

        const workout = user.workouts.find(workout => workout._id.toString() === workoutId);
        if (!workout)
        {
            return res.status(404).json({message: 'workout not found'});
        }

        user.workouts.pull(workoutId);
        await user.save();
        res.status(200).json({message: 'workout deleted successfully'});            
    } catch (error) {
        res.status(500).json({message: 'Error deleting workout', error});
    }
});

/*============= post: setting new exercise in the user db: =============*/
router.post('/:userId/workouts/:workoutId/exercises', async (req, res) => {
    const {userId, workoutId} = req.params;
    const {exercise_name, reps_or_time, sets, rest_time} = req.body;

    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        const workout = user.workouts.find(workout => workout._id.toString() === workoutId);
        if (!workout)
        {
            return res.status(404).json({message: 'workout not found'});
        }

        const new_exercise = {exercise_name, reps_or_time, sets, rest_time};
        workout.exercises.push(new_exercise);

        await user.save();
        res.status(201).json({ message: 'Exercise added successfully', new_exercise });
    } catch (error) {
        return res.status(500).json({message: 'Error adding exercise', error});
    }
});

/*============= get: retrieve user's whole exercises (1 workout) from db: =============*/
router.get('/:userId/workouts/:workoutId/exercises', async (req, res) => { 
    const {userId, workoutId} = req.params;

    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        const workout = user.workouts.find(workout => workout._id.toString() === workoutId);
        if (!workout)
        {
            return res.status(404).json({message: 'workout not found'});
        }

        res.status(200).json(workout.exercises);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving exercises', error });
    }
});

/*============= put: update exercise in user's workout =============*/
router.put('/:userId/workouts/:workoutId/exercises/:exerciseId', async (req, res) => {
    const {userId, workoutId, exerciseId} = req.params;
    const {exercise_name, reps_or_time, sets, rest_time} = req.body;

    try{
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        const workout = user.workouts.find(workout => workout._id.toString() === workoutId);
        if (!workout)
        {
            return res.status(404).json({message: 'workout not found'});
        }

        const exercise = workout.exercises.find(exercise => exercise._id.toString() === exerciseId);
        if (!exercise)
        {
            return res.status(404).json({message: 'exercise not found'});
        }

        exercise.exercise_name = exercise_name;
        exercise.reps_or_time = reps_or_time;
        exercise.sets = sets;
        exercise.rest_time = rest_time;

        await user.save()
        res.status(200).json({message: 'Exercise updated successfully', exercise});
    } catch (error) {
        res.status(500).json({message: 'Error updating exercise', error });
    }
});

/*============= delete: delete user's exercise from its db =============*/
router.delete('/:userId/workouts/:workoutId/exercises/:exerciseId', async (req, res) => {

    const {userId, workoutId, exerciseId} = req.params;
    try {
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }

        const workout = user.workouts.find(workout => workout._id.toString() === workoutId);
        if (!workout)
        {
            return res.status(404).json({message: 'workout not found'});
        }

        const exercise = workout.exercises.find(exercise => exercise._id.toString() === exerciseId);
        if (!exercise)
        {
            return res.status(404).json({message: 'exercise not found'});
        }

        workout.exercises.pull(exerciseId);
        await user.save();
        res.status(200).json({message: 'Exercise deleted successfully', exercise});
    } catch (error) {
        res.status(500).json({message: 'Error deleting exercise', error});
    }
});
/*============= Exporting router =============*/
module.exports = router;


