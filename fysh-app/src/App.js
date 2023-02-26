import { Route, Routes } from "react-router-dom";

import Home from "./routes/home/home.component";
import Navbar from "./routes/navigation/navbar.component";
import TournamentList from "./routes/tournament-list/tournament-list.component";
import Authentication from "./routes/authentication/authentication.component";
import TournamentForm from "./routes/create-new-tournament/create-new-tournament.component";
import TournamentDetails from "./routes/tournament-details/tournament-details.component";
import SignUp from "./routes/authentication/sign-up.component";
import UserSettings from "./routes/user-settings/user-setttings.component";
import PageNotFound from "./routes/404/404.component";

import DashboardPage from "./routes/dashboard/dashboard.component";

import PrivateRoute from "./routes/private-route/private-route.component";
import ForgotPasswordPage from "./routes/authentication/forgot-password.component";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournament/:id" element={<TournamentDetails />} />
        <Route path="/new-tournament" element={<PrivateRoute />}>
          <Route path="/new-tournament" element={<TournamentForm />} />
        </Route>
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/account" element={<PrivateRoute />}>
          <Route path="/account" element={<UserSettings />} />
        </Route>
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
