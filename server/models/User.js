const mongoose = require('mongoose');

// workout fields: 
const exerciseSchema = new mongoose.Schema({
  exercise_name: {
    type: String,
    required: true
  },
  reps_or_time: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  rest_time: 
  {
    type: String,
    required: true
  }
})

const workoutSchema = new mongoose.Schema({
  workout_name:
  {
    type: String,
    required: true
  },
  exercises: [exerciseSchema] // each workout contains array of exercises parameter.
})

// calendar fields:
const workoutDay = new mongoose.Schema({
  workout_name:
  {
    type: String,
    required: true
  },
  date: 
  {
    type: Date,
    required: true,
  }
})

// user collection:
const userSchema = new mongoose.Schema({ // defining the structure of MongoDB document (in this case 'User').
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  workouts: [workoutSchema], // each user contains array of workouts parameter.
  calendar: [workoutDay],
});

const User = mongoose.model('User', userSchema); // creates model based on that schema. User model represents the users collection in MongoDB

module.exports = User;