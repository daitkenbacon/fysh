import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";


const Home = () => {
    return (
        <Box>
            <div className="parent">
            <div className="main-content"> </div>
            <div className="splash">
                    <h1>
                        Go Fysh
                    </h1>
                </div>
            <div className="splash-box">
                <h4 className='splash-body'>
                    No subscription fee. No mailing checks to your winners. No snagging your net. Just fyshing.
                </h4>
            </div>
        </div>
        </Box>
    )
}

export default Home;