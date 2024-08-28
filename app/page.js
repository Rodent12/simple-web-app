"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [folderName,setFolderName] = useState("simple_web_app");
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    try {
      setUploadStatus('Uploading...');
      const { data } = await axios.post('/api/upload', {
        data: previewSource,
        folderName,  // Send folder name to the backend
      });
      setUploadStatus(`File uploaded successfully: ${data.url}`);
      fetchFileList();  // Refresh the file list after upload
    } catch (error) {
      setUploadStatus('Failed to upload file.');
    }
  };

  const fetchFileList = async () => {
    try {
      const { data } = await axios.get('/api/listFiles', {
        params: { folderName },  // Send folder name to the backend
      });
      setFileList(data.files);
    } catch (error) {
      console.error('Failed to fetch file list:', error);
    }
  };

  useEffect(() => {
    if (folderName) {
      fetchFileList();  // Fetch file list when folderName changes
    }
  }, [folderName]);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };
  

  return (
    <div>
      <h1>Upload File to Cloudinary</h1>
      <form onSubmit={handleSubmitFile}>
        <input
          type="file"
          onChange={handleFileInputChange}
          accept="image/*"
        />
        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {previewSource && <img src={previewSource} alt="Selected File" style={{ height: '200px' }} />}
      {uploadStatus && <p>{uploadStatus}</p>}
      <h2>Files in Folder: {folderName}</h2>
      <ul>
        {fileList.map((file) => (
          <li key={file.public_id}>
            <a href={file.secure_url} target="_blank" rel="noopener noreferrer">
              {file.public_id}
            </a>
            <button onClick={() => handleDownload(file.secure_url, file.public_id)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
