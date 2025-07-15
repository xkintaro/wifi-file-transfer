import 'kintaro-ui/src/root.css';
import {
  KintaroTitle1, KintaroTitle2, KintaroTitle3,
  KintaroTextBox1, KintaroTextBox2, KintaroTextBox3,
  KintaroButton1, KintaroButton2, KintaroButton3, KintaroButton4,
  KintaroButtonClose,
  KintaroDescription, KintaroModal, KintaroFooter,
  KintaroDivider1, KintaroAudioPlayer
} from 'kintaro-ui/src';

import notfoundimage from '/404.png';
import overlay from '/2.png';
import { useEffect, useState } from 'react';
import './App.css';

import { CiImageOn } from "react-icons/ci";
import { CiVideoOn } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa";
import { FaFileArchive } from "react-icons/fa";

import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileSizes, setFileSizes] = useState({});

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/files`);
      const data = await res.json();
      setFiles(data);
      setFilteredFiles(data);

      // Dosya boyutlarını al
      const sizes = {};
      await Promise.all(data.map(async (file) => {
        const sizeRes = await fetch(`${API_URL}/file-info?name=${encodeURIComponent(file)}`);
        if (sizeRes.ok) {
          const sizeData = await sizeRes.json();
          sizes[file] = formatFileSize(sizeData.size);
        }
      }));
      setFileSizes(sizes);
    } catch (error) {
      console.error('Dosyalar alınırken hata:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file =>
        file.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`${API_URL}/delete/${filename}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchFiles();
      } else {
        console.error('Dosya silinemedi');
        const errorData = await response.json();
        console.error('Hata detayı:', errorData);
      }
    } catch (error) {
      console.error('Silme işlemi sırasında hata:', error);
    }
    setModalVisible(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    uploadFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.open('POST', `${API_URL}/upload`);
      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadFiles([]);
          fetchFiles();
        }
        setIsUploading(false);
      };
      xhr.send(formData);
    } catch (error) {
      console.error('Yükleme hatası:', error);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadFiles(selectedFiles);
  };

  const removeFileFromList = (index) => {
    const newFiles = [...uploadFiles];
    newFiles.splice(index, 1);
    setUploadFiles(newFiles);
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      alert(`⚠️ JS Hatası: ${msg}\nSatır: ${lineNo}:${columnNo}`);
      return false;
    };
  }, []);

  return (
    <div className="kintaro-ui-container">

      <div className="kintaro-ui-hero">
        <div className="hero-main">
          <KintaroTitle1 title={"Kintaro File Transfer"} />
          <KintaroDescription
            text={"Share files with devices on the same network"}
          />
          <form onSubmit={handleUpload} className="kwherobtns">
            <label className="kintaro-button-reset kintaro-button-2" style={{ border: '1px solid var(--kintaro-accent-color-1)', '--kintaro-custom-hover': 'var(--kintaro-accent-color-1)', }}>
              {uploadFiles.length > 0 ? `${uploadFiles.length} files selected` : 'Select Files'}
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                multiple
              />
            </label>
            <button
              type="submit"
              className="kintaro-button-reset kintaro-button-1"
              disabled={uploadFiles.length === 0 || isUploading}
            >
              {isUploading ? `Loading... ${progress}%` : 'Upload'}
            </button>
          </form>

          {uploadFiles.length > 0 && (
            <div className="file-preview-container">
              <KintaroTitle3 title="Selected Files:" />
              <div className="file-list">
                {uploadFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFileFromList(index)}
                      className="remove-file-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <img src={overlay} alt="" className="hero-overlay" />
      </div>

      <KintaroDivider1 />

      <div className="kw-ui">
        <div className="ui-group">
          <div className="kintaro-ui-item">
            <div className="item-head">
              <KintaroTitle2 title={"Files"} />
              <div className="txtbx-hedd">
                <input
                  type="text"
                  className="kintaro-txtbox-1-textbox"
                  placeholder='Search File'
                  style={{ height: '45px' }}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            {filteredFiles.length > 0 ? (
              <div className="item-main">
                {filteredFiles.map((file) => (
                  <div key={file} className="item-box">
                    <div className="item-box-head">
                      <div className="item-icon">
                        {file.match(/\.(jpg|jpeg|png|gif)$/i) ? <CiImageOn /> :
                          file.match(/\.(mp4|mov|avi)$/i) ? <CiVideoOn /> :
                            file.match(/\.(pdf)$/i) ? <FaRegFilePdf /> : <FaFileArchive />}
                      </div>

                      <a
                        href={`${API_URL}/uploads/${file}`}
                        title={file}
                        target='_blank'
                        rel="noreferrer"
                      >
                        <KintaroDescription text={file} maxLength={"50"} />
                      </a>
                      <KintaroDescription text={"(" + fileSizes[file] + ")" || 'Loading...'} maxLength={"999"} />
                    </div>
                    <div className="item-actions">
                      <KintaroModal
                        isOpen={modalVisible && fileToDelete === file}
                        onClose={() => setModalVisible(false)}
                        title={"Delete File"}
                      >
                        <KintaroDescription
                          text={file + " Are you sure you want to delete this file?"}
                        />
                        <div className="kintaro-modal-footer">
                          <KintaroButton2
                            title={"Cancel"}
                            onClick={() => setModalVisible(false)}
                          />
                          <KintaroButton1
                            title={"Delete"}
                            onClick={() => handleDelete(file)}
                            bgColor={"var(--kintaro-error-color)"}
                            hoverColor={"var(--kintaro-error-color-transparent)"}
                          />
                        </div>
                      </KintaroModal>
                      <button
                        onClick={() => {
                          setFileToDelete(file);
                          setModalVisible(true);
                        }}
                        className="delete-button item-actions-btn"
                        title='Delete File'
                      >
                        <MdDeleteForever />
                      </button>
                      <a
                        href={`${API_URL}/uploads/${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="view-button item-actions-btn"
                        title='View File'
                      >
                        <FaRegEye />
                      </a>
                      <a
                        href={`${API_URL}/uploads/${file}`}
                        download
                        className="download-button item-actions-btn"
                        title='Download File'
                      >
                        <IoMdDownload />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-kw-file">
                <img src={notfoundimage} alt="" className="emty-file-img" />
                <KintaroTitle3 title={searchTerm ? "No matching files found" : "No file yet"} />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;