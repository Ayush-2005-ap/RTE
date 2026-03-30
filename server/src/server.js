const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});


const app = require('./app');
const connectDB = require('./config/db');

console.log('Connecting to database...');
// Connect to database
connectDB();
console.log('Database connected successfully!');

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
