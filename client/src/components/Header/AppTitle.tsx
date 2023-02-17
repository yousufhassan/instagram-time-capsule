import './AppTitle.css';

function AppTitle(props: any) {
    let username = props.username;

    if (username != null) {
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