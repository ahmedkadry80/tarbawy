import express from 'express';
import { db } from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create course
router.post('/create', async (req, res) => {
  try {
    const { teacher_id, title, description, price } = req.body;
    const is_free = price == 0;

    const [result] = await db.execute(
      'INSERT INTO courses (teacher_id, title, description, price, is_free) VALUES (?, ?, ?, ?, ?)',
      [teacher_id, title, description, price || 0, is_free]
    );

    res.status(201).json({ id: result.insertId, message: 'Course created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses by teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const [rows] = await db.execute('SELECT * FROM courses WHERE teacher_id = ?', [teacherId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all courses (for students)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM courses WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload video to course
router.post('/:courseId/videos/upload', upload.single('video'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const filePath = req.file.path;

    const [result] = await db.execute(
      'INSERT INTO videos (course_id, title, file_path) VALUES (?, ?, ?)',
      [courseId, title, filePath]
    );

    res.status(201).json({ id: result.insertId, message: 'Video uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get videos for course
router.get('/:courseId/videos', async (req, res) => {
  try {
    const { courseId } = req.params;
    const [rows] = await db.execute('SELECT * FROM videos WHERE course_id = ?', [courseId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in course
router.post('/:courseId/enroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { student_id } = req.body;

    const [result] = await db.execute(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, courseId]
    );

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Already enrolled' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get enrolled courses for student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const [rows] = await db.execute(
      'SELECT c.*, e.progress FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?',
      [studentId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;