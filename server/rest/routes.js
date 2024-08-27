import express from 'express';
import { getReminders, getImage } from './db/model/keyword.js';

const router = express.Router();

router.get('/keyword-reminders', (req, res) => {
  getReminders((error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

router.get('/keyword-image/:keyword', (req, res) => {
  const keyword = req.params.keyword;
  getImage(keyword, (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!result) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(result.image);
  });
});

export default router;