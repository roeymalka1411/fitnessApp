const express = require('express'); // creates basic web server.
const mongoose = require('mongoose'); // connecting the MongoDB where all our DB located.
const cors = require('cors'); // enables the frontend and backend to communicate.
const userRoutes = require('./routes/userRoutes'); // connecting userRoutes file (register, login, delete).
const workoutRoutes = require('./routes/workoutRoutes'); // connection workoutRoutes file.
const calendarRoutes = require('./routes/calendarRoutes'); // connection calendarRoutes file.
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // enables the server to handle json format info that it accepted.

// Basic route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Use routes
app.use('/api/users', userRoutes); // creates path for CURS users. for example: http://localhost:5000/api/users/register 
app.use('/api', workoutRoutes); // creates path for CURS workouts/exercises. for example: http://localhost:5000/api/<userId>/workouts/<workoutId>/exercises/<exerciseId>
app.use('/api/calendar', calendarRoutes); // creates path for CURS calendar. for example: http://localhost:5000/api/calendar/<userid>/updateCalendar

// MongoDB connection
const MONGODB_URL = 'mongodb://localhost:27017/my_fitness_app'; // DB URI.
mongoose.connect(MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(port, () => console.log(`server has started on port: ${port}`)); // log message if a port opened.
