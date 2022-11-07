import { Route, Routes } from 'react-router-dom';

import Home from './routes/home/home.component';
import Navbar from './routes/navigation/navbar.component';
import About from './routes/about/about.component';
import TournamentList from './routes/tournament-list/tournament-list.component';
import Authentication from './routes/authentication/authentication.component';
import TournamentForm from './routes/create-new-tournament/create-new-tournament.component';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tournaments' element={<TournamentList/>}/>
        <Route path='/new-tournament' element={<TournamentForm/>}/>
        <Route path='about' element={<About/>}/>
        <Route path='authentication' element={<Authentication />}/>
    </Routes>
  )
}

export default App;