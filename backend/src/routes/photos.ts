import express from 'express';
import { auth, AuthRequest } from '../middlewares/auth';
import { Photo } from '../models/Photo';
import { RequestHandler } from 'express';

const router = express.Router();

// Get all photos
router.get('/', (async (req, res) => {
  try {
    const photos = await Photo.find().populate('user', 'name');
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}) as RequestHandler);

// Upload a photo
router.post('/', auth, (async (req: AuthRequest, res) => {
  try {
    const photo = new Photo({
      ...req.body,
      user: req.user._id,
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ error: 'Upload failed' });
  }
}) as RequestHandler);

// Vote for a photo
router.post('/:id/vote', auth, (async (req: AuthRequest, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    res.json(photo);
  } catch (error) {
    res.status(400).json({ error: 'Vote failed' });
  }
}) as RequestHandler);

// Delete a photo
router.delete('/:id', auth, (async (req: AuthRequest, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Check if the user is the owner of the photo
    if (photo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this photo' });
    }

    await Photo.deleteOne({ _id: req.params.id });
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
}) as RequestHandler);

export default router;
