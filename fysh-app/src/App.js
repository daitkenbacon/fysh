import { Route, Routes } from 'react-router-dom';

import Home from './routes/home/home.component';
import Navbar from './routes/navigation/navbar.component';
import TournamentList from './routes/tournament-list/tournament-list.component';
import Authentication from './routes/authentication/authentication.component';
import TournamentForm from './routes/create-new-tournament/create-new-tournament.component';
import TournamentDetails from './routes/tournament-details/tournament-details.component';
import SignUp from './routes/authentication/sign-up.component';
import UserSettings from './routes/user-settings/user-setttings.component';
import PageNotFound from './routes/404/404.component';

import Checkout from './routes/checkout/Checkout';
import DashboardPage from './routes/dashboard/dashboard.component';


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tournaments' element={<TournamentList/>}/>
          <Route path='/tournament/:id' element={<TournamentDetails/>}/>
          <Route path='/new-tournament' element={<TournamentForm/>}/>
          <Route path='/dashboard' element={<DashboardPage/>}/>
          <Route path='/authentication' element={<Authentication />}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/account' element={<UserSettings/>}/>
          <Route path='*' element={<PageNotFound/>} />
      </Routes>
    </div>
  )
}

export default App;