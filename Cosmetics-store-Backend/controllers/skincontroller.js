const SkinCare = require('../models/skinCare');

exports.submitSkinCareForm = async (req, res) => {
  console.log('Received request body:', req.body);

  const { name, email, age, skinType, skinConditions, allergies, skincareRoutine, otherDetails } = req.body;

  // Check if required fields are provided
  if (!name || !email || !age || !skinType || !skinConditions || !skincareRoutine) {
    return res.status(400).json({ message: 'All fields except "otherDetails" are required' });
  }

  // Convert age to number
  const ageNumber = Number(age);
  console.log('Converted age to number:', ageNumber);

  if (isNaN(ageNumber)) {
    return res.status(400).json({ message: 'Age must be a valid number' });
  }

  let imageUrl = null; // Default to null if no image is uploaded

  if (req.files && req.files.length > 0) {
    if (req.files.length > 1) {
      return res.status(400).json({ message: 'Only one image is allowed' });
    }
    // Construct image URL
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files[0].filename}`;
  }

  try {
    const skinCareData = new SkinCare({
      name,
      email,
      age: ageNumber,
      skinType,
      skinConditions,
      allergies,
      skincareRoutine,
      otherDetails,
      images: imageUrl, // Store a single image URL
    });

    // Save to the database
    await skinCareData.save();

    res.status(201).json({
      message: 'Skin Care details submitted successfully',
      skinCareData,
    });
  } catch (err) {
    console.error('Error saving skin care data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSkinCareForms = async (req, res) => {
  try {
    const skinCareForms = await SkinCare.find();

    if (skinCareForms.length === 0) {
      return res.status(404).json({ message: 'No skin care forms found' });
    }

    res.status(200).json(skinCareForms);
  } catch (error) {
    console.error('Error fetching skin care forms:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
