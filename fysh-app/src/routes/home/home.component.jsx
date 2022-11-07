import { Outlet } from "react-router-dom";


const Home = () => {
    console.log('rendered home');
    return (
        <div>
            <h1>Home page</h1>
            <Outlet />
        </div>
    )
}

export default Home;