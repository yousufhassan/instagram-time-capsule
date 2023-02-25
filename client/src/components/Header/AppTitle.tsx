import './AppTitle.css';

function AppTitle({username}:{username: string}) {
    // console.log(username);
    
    if (username != "") {
        // A username was passed in
        username += "'s "
    }

    return (
        <div>
            <div id="app-name">{username} Instagram Time Capsule</div>
        </div>
    )
}

export default AppTitle;