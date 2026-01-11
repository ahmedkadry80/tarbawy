import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
//import path from 'path';

import authRoutes from './modules/auth.routes.js';
import courseRoutes from './modules/course.routes.js';
import videoRoutes from './modules/video.routes.js';

//2️⃣ في app.js أضف:
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
/* ===============================
   Fix __dirname for ES Modules
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app.use(helmet());           // SEO + Security
// app.use(
//   helmet({ 
//     contentSecurityPolicy: false
//   })
// );
//🟢 Helmet (الإعداد النهائي الصحيح)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  })
);




app.use(compression());      // Performance
app.use(cors());
app.use(express.json());

// Serve static files
//app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
 // Static Files (IMPORTANT)



//app.use(express.static(path.join(process.cwd(), '../frontend')));
app.use(express.static(path.join(__dirname, 'public')));


// Root route
//app.get('/', (req, res) => {
//  res.sendFile(path.join(process.cwd(), '../public/index.html'));
//});
/* ===============================
   Root
================================ */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);

// Student routes
app.use('/api/student', courseRoutes); // for enrolled courses

//2️⃣ في app.js أضف:
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));


export default app;
