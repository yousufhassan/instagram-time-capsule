import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import './UploadFile.css';
// import { Link, useNavigate } from "react-router-dom";


function UploadFile({chatDataCallback}:{chatDataCallback: Function}) {
    // alert('asdf')
    const user = JSON.parse(localStorage.getItem("user")!);
    const [files, setFiles] = useState<any[]>([]);
    const [filesSelected, setFilesSelected] = useState(false);
    const [isUploadInProgress, setIsUploadInProgress] = useState(false);

    const uploadFiles = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Render the loader spinner
        setFilesSelected(false);
        setIsUploadInProgress(true);

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
                console.log(response)
                console.log(response.data);
                
                chatDataCallback(response.data)
                setFiles([]);
                setFilesSelected(false);
                setIsUploadInProgress(false);
                // Use the below line of code instead if button is disabling too quick
                // setTimeout(() => { setFilesSelected(false) }, 2000)
            })
            .catch(function (error) {
                console.log(error);
                setFiles([]);
                setFilesSelected(false);
            });
    }

    const selectFileHandler = (e: any) => {
        setFiles(e.target.files)
        if (e.target.files.length > 0) {
            setFilesSelected(true);
        }
        else {
            setFilesSelected(false);
        }
    }

    return (
        <div>
            <form name='upload-form' onSubmit={uploadFiles}>
                <label id='add-conversation' htmlFor='file-upload' className='custom-file-upload light-grey-text'>
                    <span className="material-symbols-outlined">
                        upload_file
                    </span>
                    <p className='no-margin'>
                        Add new conversation
                    </p>
                    <button id='upload-btn' className='light-grey-bg btn' hidden={!filesSelected}>Upload {files.length} files</button>
                    <div className="loader" hidden={!isUploadInProgress}></div>
                </label>
                <input type="file" id='file-upload' accept='.json' onChange={selectFileHandler} multiple disabled={isUploadInProgress} />
            </form>
        </div>
    )
}

export default UploadFile;