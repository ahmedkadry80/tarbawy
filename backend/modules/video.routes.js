import express from 'express';
import { db } from '../config/db.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Stream video securely
router.get('/stream/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { user } = req.query; // user id for authorization

    // Check if user is enrolled in the course
    const [videos] = await db.execute(
      'SELECT v.file_path, c.id as course_id FROM videos v JOIN courses c ON v.course_id = c.id WHERE v.id = ?',
      [videoId]
    );

    if (videos.length === 0) return res.status(404).json({ error: 'Video not found' });

    const video = videos[0];

    // Check enrollment
    const [enrollment] = await db.execute(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [user, video.course_id]
    );

    if (enrollment.length === 0) return res.status(403).json({ error: 'Not enrolled in this course' });

    const filePath = video.file_path;

    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video info
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM videos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Video not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;