<a href="README.md">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square&logo=google-translate&logoColor=white" alt="English">
</a>
<a href="README-TR.md">
  <img src="https://img.shields.io/badge/Language-Türkçe-red?style=flat-square&logo=google-translate&logoColor=white" alt="Türkçe">
</a>

  <br />
  <br />

<div align="center">
  <img src="mascot.png" width="120" height="120" />
  <br />
  <br />

  <p>
     A web based tool for transferring files between devices over WiFi.
  </p>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

  <p>
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#tech">Tech</a> •
    <a href="#setup">Setup</a> •
    <a href="#gallery">Gallery</a> •
    <a href="#license">License</a>
  </p>

  <br />
  <br />
</div>

## <a id="about"></a> 📋 About

**WiFi File Transfer** is a web application for sharing files between devices on the same network. You run it on your computer and open it in the browser of another device such as your phone, so you can move files in both directions without cables or cloud services.

The backend is built with Express and keeps the files in the `uploads` folder on your computer, and the interface is built with React and my own [Kintaro UI](https://github.com/xkintaro/kintaro-ui) library.

## <a id="features"></a> ✨ Features

- **Multiple uploads**: Select and upload many files at once while following the progress.
- **Clean file names**: Turkish characters and invalid symbols are removed from file names, and the upload time is added to them.
- **In-browser preview**: Open images, videos, audio, PDF and text files directly in the browser. Images are also shown as small previews in the list.
- **Bulk actions**: Select multiple files to download them as a dated ZIP archive or to delete them.
- **Single file actions**: Download or delete any file with a single click.

## <a id="tech"></a> 🛠️ Tech

`React` · `Vite` · `Kintaro UI` · `React Icons` · `CSS` · `Node.js` · `Express` · `Multer` · `Archiver`

## <a id="setup"></a> 🚀 Setup

### Requirements

- **Node.js 18 or newer**

### Step-by-Step Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/xkintaro/wifi-file-transfer.git
   cd wifi-file-transfer
   ```

2. **Install dependencies**

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

   On Windows you can run `install-dependencies.bat` instead.

3. **Check the environment settings**

   The ports and the API address are set in the `.env` files.

   **backend/.env**

   ```
   VITE_BACKEND_PORT=5077
   ```

   **frontend/.env**

   ```
   VITE_FRONTEND_API_URL=http://localhost:5077
   VITE_FRONTEND_PORT=5076
   ```

   To use the app from another device, replace `localhost` in `VITE_FRONTEND_API_URL` with the local IP address of your computer, such as `http://192.168.1.10:5077`.

4. **Start the backend and the frontend**

   Start each one in its own terminal.

   ```bash
   cd backend
   node index.js
   ```

   ```bash
   cd frontend
   npm run dev
   ```

   On Windows you can run `run.bat` instead.

Open the app at [http://localhost:5076](http://localhost:5076). On another device, open the same port with the IP address of your computer.

## <a id="gallery"></a> 🖼️ Gallery

<img src="md/20260311100927157.jpg" width="100%" />

<img src="md/20260311100927226.jpg" />

## <a id="license"></a> 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

#

<p align="center">
  <sub>❤️ Developed by "Mustafa TAŞAL" (kintaro)</sub>
</p>
