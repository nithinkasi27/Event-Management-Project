const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/eventDB';
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define Event schema and model
const eventSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  eventType: String,
  eventStartDate: Date,
  eventEndDate: Date,
  state: String,
  district: String,
  location: String,
  participantCount: Number,
  budget: Number
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Customer registration.html'));
});

app.post('/', async (req, res) => {
  const {
    firstName, lastName, email, phoneNumber, eventType,
    eventStartDate, eventEndDate, state, district,
    location, participantCount, budget
  } = req.body;

  try {
    // Check if an event of the same type is already booked on the same start date
    const existingEvent = await Event.findOne({
      eventType: eventType,
      eventStartDate: new Date(eventStartDate)
    });

    if (existingEvent) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Event Registration Error</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: url('error-bg.jpg');
                background-size: cover;
                display: flex; 
                align-items: center;
                justify-content: center;
                height: 100vh;
              }

              .container {
                background-color: #ececee;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #ff0000;
              }

              p {
                margin-top: 20px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Error: Event Already Booked</h1>
              <p>The event type "${eventType}" has already been booked for the start date ${eventStartDate}. Please choose a different date or event type.</p>
              <p><a href="/">Go back to the registration form</a></p>
            </div>
          </body>
        </html>
      `);
    }

    // Create and save the new event if no conflict is found
    const newEvent = new Event({
      firstName,
      lastName,
      email,
      phoneNumber,
      eventType,
      eventStartDate,
      eventEndDate,
      state,
      district,
      location,
      participantCount,
      budget,
    });

    const savedEvent = await newEvent.save();

    console.log('Event saved:', savedEvent);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Registration Confirmation</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: url('15.jpg');
              background-size: cover;
              display: flex; 
              align-items: center;
              justify-content: center;
              height: 100vh;
            }

            .container {
              background-color: #ececee;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h1 {
              color: #101011;
            }

            .info-box {
              border: 1px solid #ccc;
              border-radius: 5px;
              padding: 15px;
              margin-top: 20px;
            }

            .info-box p {
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Your request matters & thank you for booking with us</h1>
            <div class="info-box">
              <p><strong>First Name:</strong> ${firstName}</p>
              <p><strong>Last Name:</strong> ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone Number:</strong> ${phoneNumber}</p>
              <p><strong>Event Type:</strong> ${eventType}</p>
              <p><strong>Event Start Date:</strong> ${eventStartDate}</p>
              <p><strong>Event End Date:</strong> ${eventEndDate}</p>
              <p><strong>State:</strong> ${state}</p>
              <p><strong>District:</strong> ${district}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Participant Count:</strong> ${participantCount}</p>
              <p><strong>Budget:</strong> ${budget}</p>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
