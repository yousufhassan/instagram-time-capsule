import '../../styles/general.css';
import './MainWindow.css';
import ConversationPanel from './CoversationsPanel';


function MainWindow() {
    const user = JSON.parse(localStorage.getItem("user")!);

    return (
        <div>
            <div id="main-container" className='flex-row'>
                <div id="conversation-panel-container" className='flex-col dark-grey-bg'>
                    <ConversationPanel />
                </div>
                <div id="chat-panel-container" className='flex-col light-grey-bg'>
                    chat
                </div>
            </div>
        </div>
    )
}

export default MainWindow;