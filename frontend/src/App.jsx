import 'kintaro-ui/src/root.css';
import {
  KintaroTitle1, KintaroTitle2, KintaroTitle3,
  KintaroButton1, KintaroButton2,
  KintaroDescription, KintaroModal,
  KintaroCheckBox, KintaroHero1
} from 'kintaro-ui/src';

import notfoundimage from '/404.png';
import { useEffect, useState } from 'react';
import './App.css';

import { CiVideoOn } from "react-icons/ci";
import { FaRegFilePdf, FaFileArchive, FaRegEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileSizes, setFileSizes] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteSelectedModalVisible, setDeleteSelectedModalVisible] = useState(false);
  const [downloadSelectedModalVisible, setDownloadSelectedModalVisible] = useState(false);

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
    setSelectedFiles(selectAll ? [] : [...files]);
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

    <div className="bg-dot-md bg-black flex flex-col gap-xs w-100p h-100p min-h-100vh">
      <KintaroModal
        isOpen={deleteSelectedModalVisible}
        onClose={() => setDeleteSelectedModalVisible(false)}
        title={`Delete ${selectedFiles.length} Files`}
      >
        <div className="kintaro-modal-content">
          <KintaroDescription
            text={`Are you sure you want to delete ${selectedFiles.length} selected files? This action cannot be undone.`}
          />
          <div className="kintaro-modal-footer">
            <KintaroButton2
              title={"Cancel"}
              onClick={() => setDeleteSelectedModalVisible(false)}
            >
              Cancel
            </KintaroButton2>
            <KintaroButton1
              title={"Delete Selected"}
              onClick={handleDeleteSelected}
              className='bg-error'
            >
              Delete Selected
            </KintaroButton1>
          </div>
        </div>
      </KintaroModal>

      <KintaroModal
        isOpen={downloadSelectedModalVisible}
        onClose={() => setDownloadSelectedModalVisible(false)}
        title={`Download ${selectedFiles.length} Files`}
      >
        <div className="kintaro-modal-content">
          <KintaroDescription
            text={`You are about to download ${selectedFiles.length} files. This may take some time depending on file sizes.`}
          />
          <div className="kintaro-modal-footer">
            <KintaroButton2
              title={"Cancel"}
              onClick={() => setDownloadSelectedModalVisible(false)}
            >
              Cancel
            </KintaroButton2>
            <KintaroButton1
              title={"Download Selected"}
              onClick={handleDownloadSelected}
              className='bg-success'
            >
              Download Selected
            </KintaroButton1>
          </div>
        </div>
      </KintaroModal>

      <KintaroHero1 height={"60vh"}>
        <KintaroTitle1>Kintaro File Transfer</KintaroTitle1>
        <KintaroDescription
          text={"Share files with devices on the same network"}
        />
        <form onSubmit={handleUpload} className="flex gap-xs margin-top-xs">
          <label className="kintaro-button-reset kintaro-button-2" >
            {uploadFiles.length > 0 ? `${uploadFiles.length} files selected` : 'Select Files'}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </label>
          <KintaroButton1
            type="submit"
            disabled={uploadFiles.length === 0 || isUploading}
          >
            {isUploading ? `Loading... ${progress}%` : 'Upload'}
          </KintaroButton1>
        </form>
        {uploadFiles.length > 0 && (
          <div className="w-100p max-w-600px margin-top-lg flex flex-col gap-xs">
            <KintaroTitle3>Selected Files:</KintaroTitle3>
            <div className="max-h-250px overflow-y-auto rounded padding-sm border-1 border-dashed border-accent">
              {uploadFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center padding-xs text-color-2">
                  <KintaroDescription maxLength={48} showToggleButton={false} text={file.name} />
                  <button
                    type="button"
                    onClick={() => removeFileFromList(index)}
                    className="flex justify-center items-center bg-transparent border-none outline-none text-error hover:text-error-transparent cursor-pointer padding-xs transition-all size-md"
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </KintaroHero1>

      <div className="flex flex-col gap-sm w-100p padding-sm margin-y-xl">
        <div className="flex flex-wrap gap-sm w-100p padding-bottom-sm">
          <div className="bg-dot-sm bg-black flex flex-col rounded w-100p box-shadow h-auto overflow-hidden border-1 border-solid border-color">
            <div className="item-head flex items-center justify-between padding-sm border-0 border-bottom-1 border-solid border-color">
              <div className="flex items-center gap-sm">
                {files.length > 0 && (
                  <KintaroCheckBox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                )}
                <KintaroTitle2>{`Files${files.length > 0 ? `: ${files.length}` : ''}`}</KintaroTitle2>
              </div>
            </div>
            {files.length > 0 ? (
              <div className="flex flex-col padding-sm gap-sm max-h-450px overflow-auto">
                {files.map((file, index) => (
                  <div key={file} className="flex justify-between items-center w-100p media-sm:flex-col media-sm:items-start media-sm:gap-sm">
                    <div className="flex gap-xs items-center">
                      <KintaroCheckBox
                        checked={selectedFiles.includes(file)}
                        onChange={() => toggleFileSelection(file)}
                      />
                      <span className="text-color-1 size-md">{index + 1}</span>
                      <div className="text-color-1 size-xl margin-left-xs">
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
                              className="w-30px h-30px max-w-100p max-h-100p rounded box-shadow object-cover"
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
                    <div className="flex items-center gap-xs media-sm:w-100p media-sm:justify-end">
                      <KintaroModal
                        isOpen={modalVisible && fileToDelete === file}
                        onClose={() => setModalVisible(false)}
                        title={"Delete File"}
                      >
                        <div className="kintaro-modal-content">
                          <KintaroDescription
                            text={file + " Are you sure you want to delete this file?"}
                          />
                          <div className="kintaro-modal-footer">
                            <KintaroButton2
                              title={"Cancel"}
                              onClick={() => setModalVisible(false)}
                            >
                              Cancel
                            </KintaroButton2>
                            <KintaroButton1
                              title={"Delete"}
                              onClick={() => handleDelete(file)}
                              className='bg-error'
                            >
                              Delete
                            </KintaroButton1>
                          </div>
                        </div>
                      </KintaroModal>
                      <button
                        onClick={() => {
                          setFileToDelete(file);
                          setModalVisible(true);
                        }}
                        className="bg-transparent cursor-pointer border-none outline-none size-lg transition-all rounded-full w-30px h-30px flex items-center justify-center text-error hover:text-error-transparent"
                        title='Delete File'
                      >
                        <MdDeleteForever />
                      </button>
                      <a
                        href={`${API_URL}/view/${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="size-lg transition-all rounded-full w-30px h-30px flex items-center justify-center text-accent hover:text-accent-transparent"
                        title='View File'
                      >
                        <FaRegEye />
                      </a>
                      <a
                        href={`${API_URL}/download/${file}`}
                        download
                        className="size-lg transition-all rounded-full w-30px h-30px flex items-center justify-center text-success hover:text-success-transparent"
                        title='Download File'
                      >
                        <IoMdDownload />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center padding-sm margin-y-xxl margin-x-auto">
                <img src={notfoundimage} alt="" className="w-150px h-fit object-cover" />
                <KintaroTitle3>No file yet</KintaroTitle3>
              </div>
            )}
          </div>
          {selectedFiles.length > 0 && (
            <div className='flex w-100p justify-end item-center gap-sm '>
              <KintaroButton2
                title={`Delete (${selectedFiles.length})`}
                onClick={() => setDeleteSelectedModalVisible(true)}
                className='border-error'
              >
                {`Delete (${selectedFiles.length})`}
              </KintaroButton2>
              <KintaroButton2
                title={`Download (${selectedFiles.length})`}
                onClick={() => setDownloadSelectedModalVisible(true)}
                className='border-success'
              >
                {`Download (${selectedFiles.length})`}
              </KintaroButton2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;