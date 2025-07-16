import 'kintaro-ui/src/root.css';
import {
  KintaroTitle1, KintaroTitle2, KintaroTitle3,
  KintaroTextBox1,
  KintaroButton1, KintaroButton2, KintaroButton4,
  KintaroDescription, KintaroModal, KintaroDivider1,
  KintaroCheckBox
} from 'kintaro-ui/src';

import notfoundimage from '/404.png';
import overlay from '/2.png';
import { useEffect, useState } from 'react';
import './App.css';

import { CiVideoOn } from "react-icons/ci";
import { FaRegFilePdf, FaFileArchive, FaRegEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileSizes, setFileSizes] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteSelectedModalVisible, setDeleteSelectedModalVisible] = useState(false);
  const [downloadSelectedModalVisible, setDownloadSelectedModalVisible] = useState(false);

  // Yeni yardımcı fonksiyonlar
  const isImageFile = (filename) => {
    return filename.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
  };

  const getFileIcon = (filename) => {
    if (filename.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) return null; // Thumbnail göstereceğiz
    if (filename.match(/\.(mp4|mov|avi|mkv|webm)$/i)) return <CiVideoOn />;
    if (filename.match(/\.(pdf)$/i)) return <FaRegFilePdf />;
    return <FaFileArchive />;
  };

  const toggleFileSelection = (filename) => {
    setSelectedFiles(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  const toggleSelectAll = () => {
    setSelectedFiles(selectAll ? [] : [...filteredFiles]);
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    try {
      const res = await fetch(`${API_URL}/delete-selected`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: selectedFiles })
      });
      if (res.ok) {
        fetchFiles();
        setSelectedFiles([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Delete selected error:', error);
    }
    setDeleteSelectedModalVisible(false);
  };

  const handleDownloadSelected = async () => {
    try {
      const res = await fetch(`${API_URL}/download-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: selectedFiles })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `downloads-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download selected error:', error);
    }
    setDownloadSelectedModalVisible(false);
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/files`);
      const data = await res.json();
      setFiles(data);
      setFilteredFiles(data);
      const sizes = {};
      await Promise.all(data.map(async (file) => {
        const res = await fetch(`${API_URL}/file-info?name=${encodeURIComponent(file)}`);
        if (res.ok) {
          const info = await res.json();
          sizes[file] = formatFileSize(info.size);
        }
      }));
      setFileSizes(sizes);
    } catch (error) {
      console.error('Fetch files error:', error);
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
    setFilteredFiles(term ? files.filter(f => f.toLowerCase().includes(term.toLowerCase())) : files);
  };

  const handleDelete = async (filename) => {
    try {
      const res = await fetch(`${API_URL}/delete/${filename}`, { method: 'DELETE' });
      if (res.ok) fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
    }
    setModalVisible(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;
    setIsUploading(true);
    setProgress(0);
    const formData = new FormData();
    uploadFiles.forEach(file => formData.append('files', file));
    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
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
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => setUploadFiles(Array.from(e.target.files));
  const removeFileFromList = (index) => {
    const updated = [...uploadFiles];
    updated.splice(index, 1);
    setUploadFiles(updated);
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="kintaro-ui-container">
      <KintaroModal
        isOpen={deleteSelectedModalVisible}
        onClose={() => setDeleteSelectedModalVisible(false)}
        title={`Delete ${selectedFiles.length} Files`}
      >
        <KintaroDescription
          text={`Are you sure you want to delete ${selectedFiles.length} selected files? This action cannot be undone.`}
        />
        <div className="kintaro-modal-footer">
          <KintaroButton2
            title={"Cancel"}
            onClick={() => setDeleteSelectedModalVisible(false)}
          />
          <KintaroButton1
            title={"Delete Selected"}
            onClick={handleDeleteSelected}
            bgColor={"var(--kintaro-error-color)"}
            hoverColor={"var(--kintaro-error-color-transparent)"}
          />
        </div>
      </KintaroModal>

      <KintaroModal
        isOpen={downloadSelectedModalVisible}
        onClose={() => setDownloadSelectedModalVisible(false)}
        title={`Download ${selectedFiles.length} Files`}
      >
        <KintaroDescription
          text={`You are about to download ${selectedFiles.length} files. This may take some time depending on file sizes.`}
        />
        <div className="kintaro-modal-footer">
          <KintaroButton2
            title={"Cancel"}
            onClick={() => setDownloadSelectedModalVisible(false)}
          />
          <KintaroButton1
            title={"Download Selected"}
            onClick={handleDownloadSelected}
            bgColor={"var(--kintaro-success-color)"}
            hoverColor={"var(--kintaro-success-color-transparent)"}
          />
        </div>
      </KintaroModal>

      <div className="kintaro-ui-hero">
        <div className="hero-main">
          <KintaroTitle1 title={"Kintaro File Transfer"} />
          <KintaroDescription
            text={"Share files with devices on the same network"}
          />
          <form onSubmit={handleUpload} className="kwherobtns">
            <label
              className="kintaro-button-reset kintaro-button-2"
              style={{
                border: '1px solid var(--kintaro-accent-color-1)',
                '--kintaro-custom-hover': 'var(--kintaro-accent-color-1)',
              }}
            >
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
        <img src={overlay} alt="hero-overlay" className="hero-overlay" />
      </div>

      <KintaroDivider1 />

      <div className="kw-ui">
        <div className="ui-group">
          <div className="kintaro-ui-item">
            <div className="item-head">
              <div className="item-head-titlee">
                {filteredFiles.length > 0 && (
                  <KintaroCheckBox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    title=""
                  />
                )}
                <KintaroTitle2 title={`Files${filteredFiles.length > 0 ? `: ${filteredFiles.length}` : ''}`} />
              </div>
              {filteredFiles.length > 0 && (
                <div className="txtbx-hedd">
                  <KintaroTextBox1
                    type="text"
                    title='Search File'
                    height={"45px"}
                    width={"300px"}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              )}
            </div>

            {filteredFiles.length > 0 ? (
              <div className="item-main">
                {filteredFiles.map((file, index) => (
                  <div key={file} className="item-box">
                    <div className="item-box-head">
                      <KintaroCheckBox
                        checked={selectedFiles.includes(file)}
                        onChange={() => toggleFileSelection(file)}
                        title=""
                      />
                      <span className="file-number">{index + 1}</span>
                      <div className="item-icon">
                        {isImageFile(file) ? (
                          <a
                            href={`${API_URL}/view/${file}`}
                            title={file}
                            target='_blank'
                            rel="noreferrer"
                          >
                            <img
                              src={`${API_URL}/view/${file}`}
                              alt="thumbnail"
                              className="file-thumbnail"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = notfoundimage;
                              }}
                            />
                          </a>
                        ) : (
                          getFileIcon(file)
                        )}
                      </div>

                      <a
                        href={`${API_URL}/view/${file}`}
                        title={file}
                        target='_blank'
                        rel="noreferrer"
                      >
                        <KintaroDescription text={file} maxLength={"40"} showToggleButton={false} />
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
                        href={`${API_URL}/view/${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="view-button item-actions-btn"
                        title='View File'
                      >
                        <FaRegEye />
                      </a>

                      <a
                        href={`${API_URL}/download/${file}`}
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
          <div className="fter-btnsss">
            {selectedFiles.length > 0 && (
              <div className='fter-btnsss-rightt'>
                <KintaroButton4
                  title={`Delete (${selectedFiles.length})`}
                  onClick={() => setDeleteSelectedModalVisible(true)}
                  color="var(--kintaro-error-color)"
                  hoverColor="var(--kintaro-error-color-transparent)"
                />
                <KintaroButton4
                  title={`Download (${selectedFiles.length})`}
                  onClick={() => setDownloadSelectedModalVisible(true)}
                  color="var(--kintaro-success-color)"
                  hoverColor="var(--kintaro-success-color-transparent)"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
