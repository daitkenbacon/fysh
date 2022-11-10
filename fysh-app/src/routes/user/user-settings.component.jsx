import { useContext, useState } from "react";

import './user-settings.styles.css';


const UserSettings = () => {

    const handleSubmit = (e) => {

    }

    return (
        <div className="user-settings-container">
            <form onSubmit={handleSubmit}>
                    <input type='text' placeholder="Display name"/>
                    <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default UserSettings;