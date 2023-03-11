import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import './UploadFile.css';
// import { Link, useNavigate } from "react-router-dom";


function UploadFile() {
    const [files, setFiles] = useState<any[]>([])
    const user = JSON.parse(localStorage.getItem("user")!);

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
            <form onSubmit={uploadFiles}>
                <label id='upload-file' htmlFor="files" className='custom-file-upload light-grey-text'>
                    <span className="material-symbols-outlined">
                        upload_file
                    </span>
                    <p className='no-margin'>
                        Add new conversation
                    </p>
                </label>
                <input type="file" id="files" name="files" multiple onChange={(e: any) => setFiles(e.target.files)} />
                {/* <button id="upload-files-btn">Upload files</button> */}
            </form>
        </div>
    )
}

export default UploadFile;