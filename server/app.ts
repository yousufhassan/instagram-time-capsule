import cors from "cors";
import express from "express";
// import { authRouter } from "auth/src/routes";
import { chatsRouter } from "./chat/src/lambda";
import { conversationsRouter } from "./conversation/routes";
import { createPool } from "./cdk-common/layers/logic/nodejs/database";
export const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

// app.use("/auth", authRouter);
app.use("/chats", chatsRouter);
app.use("/conversations", conversationsRouter);
export const pool = createPool();

// Start web app
app.get("/", (res: any) => {
    //get requests to the root ("/") will route here
    res.sendFile("./views/index.html", {
        root: __dirname,
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.listen(port, () => {
    //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});
