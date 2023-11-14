import "./AppTitle.css";

function AppTitle({ username }: { username: string }) {
    // console.log(username);

    if (username !== "") {
        // A username was passed in
        username = username.charAt(0).toUpperCase() + username.slice(1);
        username += "'s ";
    }

    return (
        <>
            <div id="app-name">{username} Instagram Time Capsule</div>
        </>
    );
}

export default AppTitle;
