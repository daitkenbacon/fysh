import { Route, Routes } from 'react-router-dom';

import Home from './routes/home/home.component';
import Navbar from './routes/navigation/navbar.component';
import About from './routes/about/about.component';
import TournamentList from './routes/tournament-list/tournament-list.component';
import Authentication from './routes/authentication/authentication.component';
import TournamentForm from './routes/create-new-tournament/create-new-tournament.component';
import TournamentDetails from './routes/tournament-details/tournament-details.component';
import SignUp from './routes/authentication/sign-up.component';


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tournaments' element={<TournamentList/>}/>
          <Route path='/tournament/:id' element={<TournamentDetails/>}/>
          <Route path='/new-tournament' element={<TournamentForm/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/authentication' element={<Authentication />}/>
          <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

export default App;