import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(UserContext);
  return currentUser ? <Outlet /> : <Navigate to="/authentication" />;
};

export default PrivateRoute;
