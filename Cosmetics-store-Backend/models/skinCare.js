  const mongoose = require('mongoose');
  const skinCareSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    skinType: { type: String, required: true },
    skinConditions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    skincareRoutine: { type: String },
    otherDetails: { type: String },
    images: { type: [String], default:[] }, // Array of image URLs
  });

  module.exports = mongoose.model('SkinCare', skinCareSchema);
