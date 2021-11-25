const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedGoals` array in User.js
const goalSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved goal id from GoogleGoals
 
  name: {
    type: String,
    required: true,
  },
});

module.exports = goalSchema;
