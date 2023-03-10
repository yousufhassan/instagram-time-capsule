import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import { Link, useNavigate } from "react-router-dom";


function UploadFile() {
    const [files, setFiles] = useState<any[]>([])
    const user = JSON.parse(localStorage.getItem("user")!);

    const uploadFiles = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append("files", files[i]);
        }

        data.append("user", user.username);

        // for (var pair of data.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }



        axios.post('http://localhost:8000/uploadFiles', data,
            { headers: { 'Content-Type': 'multipart/form-data' }})
            .then((response) => {
                console.log("yup");
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
                // alert('Incorrect username or password.')
            });
    }


    return (
        <div>
            <form onSubmit={uploadFiles}>
                <label htmlFor="files">Upload files</label>
                <input type="file" id="files" name="files" multiple onChange={(e: any) => setFiles(e.target.files)} />
                <button id="upload-files-btn">Upload files</button>
                {/* <input type="submit" /> */}
            </form>
        </div>
    )
}

export default UploadFile;