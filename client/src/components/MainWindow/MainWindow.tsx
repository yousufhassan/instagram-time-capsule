import "../../styles/general.css";
import "./MainWindow.css";
import ConversationPanel from "./CoversationsPanel";
import ChatPanel from "./ChatPanel";
import { useState } from "react";

function MainWindow() {
    // eslint-disable-next-line
    const user = JSON.parse(localStorage.getItem("user")!);
    const [activeChat, setActiveChat] = useState(Object());
    const [isPanelOpen, setPanelOpen] = useState(true);

    return (
        <div id="main-container" className="flex-row">
            {/* <div id="conversation-panel-container" className="flex-col dark-grey-bg"> */}
            <ConversationPanel
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                isPanelOpen={isPanelOpen}
                setPanelOpen={setPanelOpen}
            />
            {/* <span id="sidebar-btn">{">"}</span> */}
            {/* </div> */}
            <div id="chat-panel-container" className="flex-col light-grey-bg">
                <ChatPanel activeChat={activeChat} isPanelOpen={isPanelOpen} setPanelOpen={setPanelOpen} />
            </div>
        </div>
    );
}

export default MainWindow;
