import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import './UploadFile.css';
import ReactModal from 'react-modal';
// import { Link, useNavigate } from "react-router-dom";


function UploadFile() {
    const user = JSON.parse(localStorage.getItem("user")!);
    const [files, setFiles] = useState<any[]>([]);
    const [modal, setModal] = useState(false);

    const uploadFiles = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Add all files to a FormData object to send to server
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append("files", files[i]);
        }

        // Append the username of the logged in user to the FormData object
        data.append("user", user.username);

        axios.post('http://localhost:8000/uploadFiles', data,
            { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                // console.log("yup");
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            <ReactModal isOpen={modal} style={{
                content: {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    margin: 'auto',
                    width: '800px',
                    height: '800px',
                    border: '1px solid #ccc',
                    //   background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '20px'
                }
            }}>
                <div id="modal-container">
                    <div className="flex-row space-btwn">
                        <h2>Upload Files</h2>
                        <button onClick={() => setModal(false)}>Close Modal</button>
                    </div>
                </div>
            </ReactModal>
            <form onSubmit={uploadFiles}>
                <label id='upload-file' htmlFor="files" onClick={() => setModal(true)} className='custom-file-upload light-grey-text'>
                    <span className="material-symbols-outlined">
                        upload_file
                    </span>
                    <p className='no-margin'>
                        Add new conversation
                    </p>
                </label>
                {/* <button onClick={() => setModal(true)} /> */}
                {/* <input type="file" id="files" name="files" multiple onChange={() => setModal(true)} /> */}
                {/* <button id="upload-files-btn">Upload files</button> */}
            </form>
        </div>
    )
}

export default UploadFile;