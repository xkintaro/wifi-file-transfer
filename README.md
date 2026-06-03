<a href="README.md">
 <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square&logo=google-translate&logoColor=white" alt="English">
</a>
<a href="README-TR.md">
 <img src="https://img.shields.io/badge/Dil-Türkçe-red?style=flat-square&logo=google-translate&logoColor=white" alt="Türkçe">
</a>

  <br />
  <br />

<div align="center">
  <img src="md/logo.png" width="120" height="120" />
  <br />
  <br />

  <p>
    A fast and easy-to-use local web-based WiFi file transfer tool.
  </p>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

  <p>
    <a href="#features">Features</a> •
    <a href="#technologies">Technologies</a> •
    <a href="#installation">Installation</a> •
    <a href="#license">License</a> •
    <a href="#gallery">Gallery</a>
  </p>

  <br />
  <br />
</div>

## 📋 About

**Kintaro WiFi File Transfer** is a modern, web-based tool designed to make file sharing effortless between devices on the same local network. Whether you're moving files from your computer to your phone or vice versa, this tool ensures seamless transfer without the need for cables or external cloud services.

<img src="md/20260311100927157.jpg" width="100%"  />

## <a id="features"></a>✨ Features

### Rapid WiFi Transfer

Transfer files instantly across any device connected to your local network. No cables, no bluetooth pairing, just pure speed over WiFi.

### Advanced File Management

- **Batch Uploads**: Drag and drop multiple files at once.
- **Batch Operations**: Select multiple files to download as a single **ZIP** archive or delete them in bulk.
- **Auto-Sanitization**: Filenames are automatically cleaned of Turkish characters and invalid symbols for cross-platform compatibility.

### Seamless Media Preview

View or listen to your files directly in the browser before downloading:

- **Images**: `JPG`, `PNG`, `GIF`, `WEBP`
- **Video & Audio**: `MP4`, `WEBM`, `MP3`
- **Documents**: Built-in support for `PDF`, `TXT`, and `HTML`.

## <a id="technologies"></a>🛠️ Technologies

The project utilizes a modern full-stack JavaScript architecture:

### Frontend

- **React 19**: Latest React features for a highly responsive UI.
- **Vite**: Ultra-fast build tool and development server.
- **Axios**: Robust HTTP client for API communication.
- **React Icons**: Comprehensive icon library for a polished look.

### Backend

- **Node.js**: Scalable runtime environment.
- **Express**: Minimalist web framework for the API.
- **Multer**: Middleware for handling multi-part file uploads.
- **Archiver**: On-the-fly ZIP generation for batch downloads.

## 🚀 Installation <a id="installation"></a>

Follow the steps below to run the project in your local environment.

### Requirements

- **Node.js** (v18+)
- **npm**

### Step-by-Step Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/xkintaro/wifi-file-transfer.git
    cd wifi-file-transfer
    ```

2.  **Install Backend Dependencies**

    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Environment Configuration**  
    Ensure the `.env` files in both folders are configured.

    **backend/.env**

    ```
    VITE_BACKEND_PORT=5077
    ```

    **frontend/.env**

    ```
    VITE_FRONTEND_API_URL=http://localhost:5077
    VITE_FRONTEND_PORT=5076
    ```

5.  **Start the Backend Server**

    ```bash
    cd ../backend
    node index.js
    ```

6.  **Start the Frontend Server**
    Open a new terminal:
    ```bash
    cd frontend
    npm run dev
    ```

## 📄 License <a id="license"></a>

This project is licensed under the MIT License. You can review the [LICENSE](LICENSE) file for details.

## 🖼️ Gallery <a id="gallery"></a>

<img src="md/20260311100927226.jpg" width="auto"  />

#

<p align="center">
  <sub>❤️ Developed by "Mustafa TAŞAL" (kintaro)</sub>
</p>