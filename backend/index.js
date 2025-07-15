require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.VITE_BACKEND_PORT;
const VITE_UPLOAD_DIR = process.env.VITE_UPLOAD_DIR;

// Uploads dizini yoksa oluştur
if (!fs.existsSync(VITE_UPLOAD_DIR)) {
  fs.mkdirSync(VITE_UPLOAD_DIR, { recursive: true });
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, VITE_UPLOAD_DIR)));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, VITE_UPLOAD_DIR));
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const formatNumber = (n) => n.toString().padStart(2, '0');
    const formatMs = (n) => n.toString().padStart(3, '0');

    const day = formatNumber(now.getDate());
    const month = formatNumber(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = formatNumber(now.getHours());
    const minutes = formatNumber(now.getMinutes());
    const seconds = formatNumber(now.getSeconds());
    const ms = formatMs(now.getMilliseconds());

    const ext = path.extname(file.originalname);
    const filename = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${ms}${ext}`;

    cb(null, filename);
  }
});

const upload = multer({ storage }).array('files');

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const response = req.files.map(file => ({
      message: 'Dosya yüklendi',
      filename: file.filename,
      displayName: Buffer.from(file.originalname, 'latin1').toString('utf8')
    }));

    res.json(response);
  });
});

app.get('/files', (req, res) => {
  fs.readdir(path.join(__dirname, VITE_UPLOAD_DIR), (err, files) => {
    if (err) return res.status(500).json({ error: 'Listeleme hatası' });
    res.json(files);
  });
});

app.get('/file-info', (req, res) => {
  const fileName = req.query.name;
  const filePath = path.join(__dirname, VITE_UPLOAD_DIR, fileName);

  fs.stat(filePath, (err, stats) => {
    if (err) return res.status(404).json({ error: 'Dosya bulunamadı' });

    res.json({
      size: stats.size,
      lastModified: stats.mtimeMs
    });
  });
});

app.delete('/delete/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, VITE_UPLOAD_DIR, fileName);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Silme hatası' });
    res.json({ message: 'Dosya silindi' });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend çalışıyor: http://localhost:${PORT}`);
  console.log(`📂 Dosyalar şu dizinde saklanıyor: ${path.join(__dirname, VITE_UPLOAD_DIR)}`);
});