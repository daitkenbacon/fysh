import * as React from 'react';
import { useEffect, useState, useContext } from 'react';

import { getDocInCollection, updateDocInCollection } from '../../utils/firebase/firebase.utils';

import './tournament-card.styles.css'

import { UserContext } from '../../contexts/user.context';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';

import { toast, Toaster } from 'react-hot-toast';

import PropTypes from 'prop-types';
import { Link, Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { useNavigate } from 'react-router-dom';

const TournamentCard = ({tournament}) => {
  const {
    name,
    description,
    registration_fee,
    max_participants,
    participants,
    end_date,
    image,
    id,
    author,
  } = tournament;

  const navigate = useNavigate();
  const [userName, setUserName] = useState('Fysher');
  const [isRegistering, setIsRegistering] = useState(false);
  const { currentUserUID, currentUser } = useContext(UserContext);

  const new_end_date = new Date(end_date.seconds * 1000).toLocaleDateString('en-US');

  useEffect(() => {
          async function getUserData() {
              const user = await getDocInCollection('users', author);
              setUserName(user.data().displayName);
          }
          if(author) {
            getUserData();
          }
      }, [])

  const delay = (millisec) => {
    return new Promise(resolve => {
      setTimeout(() => { resolve('') }, millisec);
    })
  }

  async function handleRegister() {
    setIsRegistering(true);
    if(!currentUserUID) {
      toast.error('You must be logged in to register for a tournament.');
      setIsRegistering(false);
      return;
    }
    try {
      const tournDoc = await getDocInCollection('tournaments', id);
      const participantsQuery = tournDoc.data().participants;
        if(participantsQuery.length >= max_participants){
          toast.error('Tournament is full.');
          setIsRegistering(false);
          return;
        }
        if(participantsQuery.includes(currentUserUID)) {
          toast.error('You are already registered for this tournament!')
          setIsRegistering(false);
          return;
        }
      updateDocInCollection('tournaments', id, {participants: [...participants, currentUserUID]})
      toast.success(`You registered for ${name}!`);
      await delay(1000);
      setIsRegistering(false);
      await delay(1000);
      navigate(`/tournament/${id}`);
    } catch (err) {
      toast.error(err);
      setIsRegistering(false);
      console.error(err);
    }
  }

  return (
    <div key={id} className="group relative">
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/tournament/${id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {description.substring(0, 80)}
            {description.length > 100 && '...'}
    </p>
        </div>
        <p className="text-sm font-medium text-gray-900">{registration_fee}</p>
      </div>
    </div>
  );
}

export default TournamentCard;

    // <Card 
    //     className='card-container'
    //     sx={{ 
    //     width: 325,
    //     borderRadius: 2,
    //     margin: 2,
    //     minWidth: 50,
    //     backgroundColor: '#193441',
    //     boxShadow: '3px 3px 10px'
    //      }}>
    //        <Toaster />
    //   <CardMedia
    //     component="img"
    //     height="160"
    //     image={image}
    //     alt={name}
    //   />
    //   <CardContent 
    //     className='card-content'
    //     sx={{
    //     color: '#d1dbbd;'
    //   }}>
    //     <Typography gutterBottom variant="h5" component="div">
    //       {name}
    //     </Typography>
    //     <Typography variant="body2" color="#FFFFFF">
    //       {description.substring(0, 120)}
    //       {description.length > 100 && '...'}
    //     </Typography>
    //     <Typography variant='body2' color="#b3b3b3">Hosted by {userName}</Typography>
    //     <div className='card-info'>
    //       <div className='date-info'>
    //         <CalendarMonthIcon />
    //         <Typography variant='subtitle1'>{new_end_date}</Typography>
    //       </div>
    //       <div className='participants-info'>
    //         <Typography>{participants ? participants.length : '0'}/{max_participants}</Typography> 
    //         <GroupsIcon/>
    //       </div>
    //     </div>
    //   </CardContent>
    //   <CardActions className='card-buttons'>
    //     <Button onClick={() => navigate(`/tournament/${tournament.id}`, tournament.id)} sx={{color: '#FCFFF5'}} size="small">Details</Button>
    //             <Button 
    //     disabled={(!(participants && participants.length < max_participants) || participants.includes(currentUserUID))} onClick={() => handleRegister()} 
    //     sx={{backgroundColor: '#3E606F'}} 
    //     variant='contained' 
    //     size="small"
    //     >
    //         {participants &&
    //         participants.includes(currentUserUID) ? 'Registered' : `$${registration_fee} Register`}
    //     </Button>
    //   </CardActions>
    // </Card>