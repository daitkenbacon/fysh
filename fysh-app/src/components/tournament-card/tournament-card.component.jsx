import * as React from 'react';
import { useEffect, useState, useContext } from 'react';

import { getDocInCollection, updateDocInCollection } from '../../utils/firebase/firebase.utils';

import './tournament-card.styles.css'
import { UserGroupIcon } from '@heroicons/react/24/solid';

import { UserContext } from '../../contexts/user.context';

import { toast, Toaster } from 'react-hot-toast';

import { Link, Link as RouterLink, MemoryRouter } from 'react-router-dom';
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
  const [canRegister, setCanRegister] = useState(true);
  const { currentUserUID, currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const new_end_date = new Date(end_date.seconds * 1000).toLocaleDateString('en-US');

  useEffect(() => {
          async function getUserData() {
              const user = await getDocInCollection('users', author);
              setUserName(user.data().displayName);
              setCanRegister((participants && participants.length < max_participants) || !participants.includes(currentUserUID));
          }
          if(author) {
            setIsLoading(true);
            getUserData();
          }
          setIsLoading(false);
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
      const tournamentDoc = await getDocInCollection('tournaments', id);
      const participantsQuery = tournamentDoc.data().participants;
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
    <div key={id} 
    className={`group relative duration-200 transform transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'} ease-out`}
     >
      <div className="relative group min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-50 transition-opacity lg:aspect-none lg:h-80">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:scale-110 transition-transform"
        />
      </div>
      <h1 className='hidden gap-4 flex-col group-hover:flex absolute font-bold top-1/4 left-1/2 -translate-x-1/2 text-center'>
          <button className='bg-white p-1 rounded-md'>
            <Link to={`/tournament/${id}`}>
              Details
            </Link>
          </button>
          <button 
            disabled={!canRegister} 
            onClick={() => handleRegister()} 
            className={`${canRegister ? 'bg-white' : 'bg-gray-600'} p-1 rounded-md`}>
              {participants &&
                participants.includes(currentUserUID) ? 'Registered' : `$${registration_fee} Register`
              }
          </button>
        </h1>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/tournament/${id}`}>
              {name}
            </Link>
          </h3>
        </div>
        <div className='flex gap-2 flex-row'>
          <UserGroupIcon className='h-5 w-5' aria-hidden='true'/>
          <p className="text-sm font-medium text-gray-900">
            {participants ? participants.length : '0'}/{max_participants}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">${registration_fee}</p>
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