import "../../styles/general.css";
import "./ChatPanel.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";

function ChatTitle({ chatTitle, bgColor }: { chatTitle: string; bgColor: string }) {
    return (
        <div>
            <div className="chat-title-container flex-row center">
                <span className="flex-row center chat-title-img" style={{ backgroundColor: bgColor }}></span>
                <h3>{chatTitle}</h3>
            </div>
        </div>
    );
}

/**
 * The format of message is
 *      {
 *          'sender_name': string,
 *          'timestamp_ms': number,
 *          'content': string
 *      }
 *
 * but it may also include additional fields depending on type of message.
 * That is why it's type is 'any'.
 *
 * */
function MessageBubble({ activeChatTitle, message }: { activeChatTitle: string; message: any }) {
    const getTimeFromUnix = (timestamp: number): string => {
        let datetime = new Date(message["timestamp_ms"]);
        let time = datetime.toLocaleString("default", { hour: "numeric", minute: "2-digit" });
        return time;
    };

    if (message) {
        // If the other (non-logged in) user sent the message
        if (activeChatTitle === message.sender_name) {
            if (message.content === "Cannot load this type of message") {
                return (
                    <div>
                        <div
                            className="flex-row"
                            style={{
                                alignItems: "center",
                                justifyContent: "left",
                                flexDirection: "row-reverse",
                            }}
                        >
                            <div className="message-bubble-container friend-message error-message">
                                {message.content}
                            </div>
                            <div className="message-timestamp">{getTimeFromUnix(message.timestamp_ms)}</div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <div
                            className="flex-row"
                            style={{
                                alignItems: "center",
                                justifyContent: "left",
                                flexDirection: "row-reverse",
                            }}
                        >
                            <div className="message-bubble-container friend-message main-sage-bg white-text">
                                {message.content}
                            </div>
                            <div className="message-timestamp">{getTimeFromUnix(message.timestamp_ms)}</div>
                        </div>
                    </div>
                );
            }
        }

        // If the logged in user sent the message
        else {
            if (message.content === "Cannot load this type of message") {
                return (
                    <div>
                        <div className="flex-row" style={{ alignItems: "center" }}>
                            <div className="message-bubble-container user-message error-message">{message.content}</div>
                            <div className="message-timestamp">{getTimeFromUnix(message.timestamp_ms)}</div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <div className="flex-row" style={{ alignItems: "center" }}>
                            <div className="message-bubble-container user-message dark-grey-bg white-text">
                                {message.content}
                            </div>
                            <div className="message-timestamp">{getTimeFromUnix(message.timestamp_ms)}</div>
                        </div>
                    </div>
                );
            }
        }
    } else {
        console.log("something weird");
        return <div></div>;
    }
}

function ChatPanel({ activeChat }: { activeChat: any }) {
    const [messageList, setMessageList] = useState(Array<JSX.Element>());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarDisplayed, setCalendarDisplayed] = useState(false);

    const convertDateToString = (date: string | Date): string => {
        if (typeof date === "object") {
            return date.toLocaleString("default", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        } else {
            let dateObj = new Date(date);
            dateObj.setDate(dateObj.getDate() + 1);
            return dateObj.toLocaleString("default", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        }
    };

    const toggleCalendar = () => {
        setCalendarDisplayed(!calendarDisplayed);
    };

    const dateChangeHandler = (e: any) => {
        console.log(e.target.value);
        setSelectedDate(e.target.value);
    };

    const deleteChat = () => {
        axios
            .post("https://j3dpvx7fh2q3rcfbzwmpf3phdi0zvzzk.lambda-url.us-east-2.on.aws/", {
                chatId: activeChat.chat_id,
            })
            .then(() => {
                window.location.reload();
            })
            .catch((response) => {
                alert("Something went wrong when trying to delete the chat.");
                console.log(response);
            });
    };

    useEffect(() => {
        const displayChat = async () => {
            // let date = '2022-10-10'  // TODO: get date from user input
            // let date = selectedDate;
            // let dateObj = new Date(date);
            // dateObj.setDate(dateObj.getDate() + 1)
            // setSelectedDate(dateObj);

            axios
                .post("http://localhost:8000/conversations/getConversationOnDate", {
                    date: selectedDate,
                    chatId: activeChat.chat_id,
                })
                .then((response) => {
                    let rawMessageList = response.data;

                    let newMessageList = new Array<JSX.Element>();

                    for (let i = rawMessageList.length - 1; i >= 0; i--) {
                        // console.log(rawMessageList[i]);

                        let message = rawMessageList[i];

                        // If the message contains no text-content (i.e. link, photo, post, etc.), then
                        // set text-content to be an error message.
                        if (!("content" in rawMessageList[i])) {
                            message["content"] = "Cannot load this type of message";
                            // console.log(message);
                        }

                        // This block of code decodes the Facebook styled encoding to UTF-8
                        // Solution taken from: https://stackoverflow.com/questions/54067194/convert-facebook-json-file-sequences-like-u00f0-u009f-u0098-u008a-to-emoji-char
                        else {
                            let arr: number[] = [];
                            for (let i = 0; i < message["content"].length; i++) {
                                arr.push(message["content"].charCodeAt(i));
                            }
                            message["content"] = Buffer.from(arr).toString("utf8");
                            // console.log(message["content"]);
                        }

                        // Add message to list of messages
                        newMessageList.push(
                            <li key={i}>
                                <MessageBubble activeChatTitle={activeChat.title} message={message} />
                            </li>
                        );
                    }

                    setMessageList(newMessageList);
                })
                .catch(function (error) {
                    console.log("Error: " + error);
                });
        };
        displayChat();
    }, [activeChat, selectedDate]);

    if (Object.keys(activeChat).length === 0) {
        // TODO: Display something in the chat panel to signify this
        return (
            <div>
                <div id="chat-panel-header" className="flex-row space-btwn"></div>
                <div id="chat-area" className="no-active-chat">
                    {/* TODO: Center this in the chat area */}
                    <h3>Select a chat to view from the list or add a new one.</h3>
                </div>
            </div>
        );
    } else if (messageList.length === 0) {
        return (
            <div>
                <div id="chat-panel-header" className="flex-row space-btwn">
                    <div className="flex-row center">
                        <ChatTitle chatTitle={activeChat.title} bgColor={activeChat.bg_color} />
                        <hr />
                        <p style={{ fontSize: "14px" }}>{convertDateToString(selectedDate)}</p>
                    </div>
                    <div className="icons-container flex-row center">
                        <div id="select-date-form-container">
                            <form
                                name="select-conversation-date"
                                onSubmit={() => {
                                    console.log("submitted!");
                                }}
                            >
                                <input
                                    onChange={dateChangeHandler}
                                    type="date"
                                    id="select-date"
                                    hidden={!calendarDisplayed}
                                />
                                <label htmlFor="select-date">
                                    <span onClick={toggleCalendar} className="material-symbols-outlined icon btn">
                                        {" "}
                                        calendar_month{" "}
                                    </span>
                                </label>
                            </form>
                        </div>
                        <span className="material-symbols-outlined icon btn"> casino </span>
                        <span className="material-symbols-outlined icon btn"> info </span>
                        <span
                            onClick={deleteChat}
                            className="material-symbols-outlined icon btn"
                            style={{ color: "red" }}
                        >
                            delete
                        </span>
                    </div>
                </div>
                <div id="chat-area" className="no-active-chat">
                    {/* TODO: Center this in the chat area */}
                    <h3>No messages sent on this date.</h3>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div id="chat-panel-header" className="flex-row space-btwn">
                <div className="flex-row center">
                    <ChatTitle chatTitle={activeChat.title} bgColor={activeChat.bg_color} />
                    <hr />
                    <p style={{ fontSize: "14px" }}>{convertDateToString(selectedDate)}</p>
                </div>
                <div className="icons-container flex-row center">
                    <div id="select-date-form-container">
                        <form
                            name="select-conversation-date"
                            onSubmit={() => {
                                console.log("submitted!");
                            }}
                        >
                            <input
                                onChange={dateChangeHandler}
                                type="date"
                                id="select-date"
                                hidden={!calendarDisplayed}
                            />
                            <label htmlFor="select-date">
                                <span onClick={toggleCalendar} className="material-symbols-outlined icon btn">
                                    {" "}
                                    calendar_month{" "}
                                </span>
                            </label>
                        </form>
                    </div>
                    <span className="material-symbols-outlined icon btn"> casino </span>
                    <span className="material-symbols-outlined icon btn"> info </span>
                    <span onClick={deleteChat} className="material-symbols-outlined icon btn" style={{ color: "red" }}>
                        delete
                    </span>
                </div>
            </div>
            <div id="chat-area">
                <ul>{messageList}</ul>
            </div>
        </div>
    );
}

export default ChatPanel;
