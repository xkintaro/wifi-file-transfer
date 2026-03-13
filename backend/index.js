require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.VITE_BACKEND_PORT;
const VITE_UPLOAD_DIR = process.env.VITE_UPLOAD_DIR;

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

const sanitizeFilename = (filename) => {
  const turkishChars = {
    'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c', 'ı': 'i',
    'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C', 'İ': 'I'
  };
  const replacementChar = '-';
  return filename
    .replace(/[ğüşıöçĞÜŞİÖÇ]/g, char => turkishChars[char] || char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\-_.]/g, replacementChar)
    .replace(new RegExp(`[${replacementChar}]+`, 'g'), replacementChar)
    .replace(new RegExp(`^[${replacementChar}]+`), '')
    .replace(new RegExp(`[${replacementChar}]+$`), '')
    .replace(/^\.+/, '')
    .substring(0, 255)
    .toLowerCase();
};

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
    const rawName = path.basename(file.originalname, path.extname(file.originalname));
    const ext = path.extname(file.originalname);
    const safeName = sanitizeFilename(rawName);
    const filename = `${safeName}_${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${ms}${ext}`;
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
    if (err) return res.status(500).json({ error: err.message });
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    const response = req.files.map(file => ({
      message: 'File uploaded',
      filename: file.filename,
      displayName: Buffer.from(file.originalname, 'latin1').toString('utf8')
    }));
    res.json(response);
  });
});

app.get('/files', (req, res) => {
  fs.readdir(path.join(__dirname, VITE_UPLOAD_DIR), (err, files) => {
    if (err) return res.status(500).json({ error: 'List Error' });
    res.json(files);
  });
});

app.get('/file-info', (req, res) => {
  const fileName = req.query.name;
  const filePath = path.join(__dirname, VITE_UPLOAD_DIR, fileName);
  fs.stat(filePath, (err, stats) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.json({
      size: stats.size,
      lastModified: stats.mtimeMs
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, VITE_UPLOAD_DIR, fileName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath, fileName);
});

app.delete('/delete/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, VITE_UPLOAD_DIR, fileName);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Delete Error' });
    res.json({ message: 'File deleted' });
  });
});

app.delete('/delete-selected', (req, res) => {
  const filesToDelete = req.body.files;
  if (!Array.isArray(filesToDelete)) return res.status(400).json({ error: 'Invalid request format' });
  let errors = [];
  let deletedCount = 0;
  filesToDelete.forEach(file => {
    const filePath = path.join(__dirname, VITE_UPLOAD_DIR, file);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedCount++;
      } else {
        errors.push({ file, error: 'File not found' });
      }
    } catch (err) {
      errors.push({ file, error: err.message });
    }
  });
  if (errors.length > 0) {
    return res.status(207).json({
      message: `Some files couldn't be deleted`,
      deletedCount,
      errorCount: errors.length,
      errors
    });
  }
  res.json({ message: `${deletedCount} files deleted successfully` });
});

app.post('/download-selected', (req, res) => {
  const filesToDownload = req.body.files;
  if (!Array.isArray(filesToDownload)) return res.status(400).json({ error: 'Invalid request format' });
  const archive = archiver('zip', { zlib: { level: 9 } });
  res.attachment('downloads.zip');
  res.setHeader('Content-Type', 'application/zip');
  archive.pipe(res);
  filesToDownload.forEach(file => {
    const filePath = path.join(__dirname, VITE_UPLOAD_DIR, file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file });
    }
  });
  archive.finalize();
});

app.get('/view/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, VITE_UPLOAD_DIR, fileName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.txt': 'text/plain',
    '.html': 'text/html'
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', 'inline');
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`✅ Server is running: ${PORT}`);
  console.log(`📂 uploads folder path: ${path.join(__dirname, VITE_UPLOAD_DIR)}`);
});
