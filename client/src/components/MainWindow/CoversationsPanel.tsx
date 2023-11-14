import "../../styles/general.css";
import "./ConversationPanel.css";
import UploadFile from "../UploadFile/UploadFile";
import { useEffect, useState } from "react";
import axios from "axios";

function ChatItem({ chatTitle, numMessages, bgColor }: { chatTitle: string; numMessages: number; bgColor: string }) {
    return (
        <div>
            <div className="flex-row center chat-item-container">
                <span className="flex-row center chat-item-img" style={{ backgroundColor: bgColor }}></span>
                <div className="chat-item-details">
                    <h3 className="no-margin white-text">{chatTitle}</h3>
                    <p className="thin white-text">{numMessages} messages</p>
                </div>
            </div>
        </div>
    );
}

function ConversationPanel({
    activeChat,
    setActiveChat,
    isPanelOpen,
    setPanelOpen,
}: {
    activeChat: any;
    setActiveChat: Function;
    isPanelOpen: boolean;
    setPanelOpen: Function;
}) {
    const user = JSON.parse(localStorage.getItem("user")!);
    const [chatList, setChatList] = useState(Array<JSX.Element>());
    // console.log(activeChat);
    // console.log(chatList);

    const selectChat = (chatData: any) => {
        setActiveChat(chatData);

        // Below code is debugging purposes
        // TODO: why is this chatList empty????
        // console.log(chatList);
        // console.log(activeChat);

        // for (let i = 0; i < chatList.length; i++) {
        //     console.log(chatList);
        // }
    };

    useEffect(() => {
        const initializeChatList = async () => {
            let username = user.username;
            axios
                .post("https://m2krivinu7cgg5optgirsfhnam0kiryi.lambda-url.us-east-2.on.aws/", { username })
                .then((response) => {
                    let initialChatList = new Array<JSX.Element>();
                    let rawChatList = response.data;
                    rawChatList.map(
                        (chat: { chat_id: number; title: string; num_messages: number; bg_color: string }) =>
                            initialChatList.push(
                                <li
                                    key={chat.chat_id}
                                    onClick={() => {
                                        selectChat(chat);
                                    }}
                                >
                                    <ChatItem
                                        chatTitle={chat.title}
                                        numMessages={chat.num_messages}
                                        bgColor={chat.bg_color}
                                    />
                                </li>
                            )
                    );

                    setChatList(initialChatList);
                })
                .catch(function (error) {
                    console.log("Error: " + error);
                });
        };
        initializeChatList();
        // eslint-disable-next-line
    }, []);

    const addChatToChatList = (chatData: {
        chatId: number;
        chatTitle: string;
        numMessages: number;
        bgColor: string;
    }) => {
        // Creating new ChatItem component
        let newChat = (
            <li
                key={chatData.chatId}
                onClick={() => {
                    selectChat(chatData);
                }}
            >
                <ChatItem
                    chatTitle={chatData.chatTitle}
                    numMessages={chatData.numMessages}
                    bgColor={chatData.bgColor}
                />
            </li>
        );

        let replaceIdx = -1; // Index of existing chat to replace in chatList

        // Find if chat with this title already exists in chatList
        for (let i = 0; i < chatList.length; i++) {
            setTimeout(() => {}, 1000);
            console.log(chatList[i].props.children.props.chatTitle);
            const chatTitle = chatList[i].props.children.props.chatTitle;
            if (chatTitle === chatData.chatTitle) {
                replaceIdx = i;
            }
        }

        if (replaceIdx === -1) {
            // Chat did not already exist, so append it to chatList
            setChatList([...chatList, newChat]);
        } else {
            // Chat previously existed, so replace it
            let newChatList = chatList.map((chat, idx) => {
                if (idx === replaceIdx) {
                    return newChat;
                } else {
                    return chat;
                }
            });
            setChatList(newChatList);
        }
        window.location.reload();
    };

    const hideConversationPanel = () => {
        setPanelOpen(false);
    };

    return (
        <>
            <div id={`conversation-panel-container${isPanelOpen ? "" : "-closed"}`} className="flex-col dark-grey-bg">
                <div id="conversation-panel-header" className="flex-row">
                    <h3 className="light-grey-text">Conversations</h3>
                    <span id="sidebar-btn-close" className="light-grey-text btn" onClick={hideConversationPanel}>
                        {"<"}
                    </span>
                </div>
                <div id="conversation-list">
                    <ul>{chatList}</ul>
                </div>
                <div id="conversation-panel-footer">
                    <UploadFile chatDataCallback={addChatToChatList} />
                </div>
            </div>
        </>
    );
}

export default ConversationPanel;
