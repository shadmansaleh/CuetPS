import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Exhibition from '../models/Adexhibition'; // Ensure this model is correctly imported

const router = express.Router();

// ✅ Create an exhibition (Clean and safe)
router.post('/admin', asyncHandler(async (req: Request, res: Response) => {
  const { title, description, start_date, end_date, themePhotoUrl } = req.body;

  // Validate input fields
  if (!title || !description || !start_date || !end_date || !themePhotoUrl) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Create a new exhibition object
  const newExhibition = new Exhibition({
    title,
    description,      // Added description field
    start_date,       // Added start_date field
    end_date,         // Added end_date field
    themePhotoUrl,    // Added themePhotoUrl field
    status: 'upcoming', // You can default this to 'upcoming' or any appropriate initial status
    created_at: new Date(),
  });

  // Save the new exhibition to the database
  await newExhibition.save();

  // Respond with the newly created exhibition
  res.status(201).json(newExhibition);
}));

// ✅ Fetch all exhibitions (Clean and safe)
router.get('/admin', asyncHandler(async (req: Request, res: Response) => {
  // Fetch all exhibitions from the database
  const exhibitions = await Exhibition.find();

  // Respond with the exhibitions data
  res.status(200).json(exhibitions);
}));

export default router;
