import * as React from 'react';
import { useEffect, useState, useContext } from 'react';

import { updateDocInCollection } from '../../utils/firebase/firebase.utils';

import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/solid';

import { UserContext } from '../../contexts/user.context';

import { toast } from 'react-hot-toast';

import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TournamentsContext } from '../../contexts/tournaments.context';

const TournamentCard = ({tournament}) => {
  const {
    name,
    description,
    registration_fee,
    max_participants,
    participants,
    end_date,
    start_date,
    image,
    id,
    author,
  } = tournament;

  const navigate = useNavigate();
  const [userName, setUserName] = useState('Fysher');
  const [isRegistering, setIsRegistering] = useState(false);
  const [canRegister, setCanRegister] = useState(true);
  const { currentUserUID, getUser, users } = useContext(UserContext);
  const { getTournament } = useContext(TournamentsContext);
  const [isLoading, setIsLoading] = useState(true);

  const new_end_date = new Date(end_date.seconds * 1000).toLocaleDateString('en-US');
  const new_start_date = new Date(start_date.seconds * 1000).toLocaleDateString('en-US');;

  useEffect(() => {
          async function getUserData() {
              const user = getUser(author);
              setUserName(user.displayName);
              if(participants.includes(currentUserUID)) {
                setCanRegister(false);
              } else if(participants.length >= max_participants) {
                setCanRegister(false);
              }
              
              setIsLoading(false);
            }
          if(author && users){
            getUserData();
          }
      }, [author])

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
      const tournamentDoc = getTournament(id);
      const participantsQuery = tournamentDoc.participants;
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
    className={`group bg-gray-100 p-5 rounded-md relative duration-200 transform transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'} ease-out`}
     >
      <div className="relative group min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 transition-opacity lg:aspect-none lg:h-80">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:scale-110 transition-transform"
        />
      </div>
      <div className='hidden gap-4 flex-col group-hover:flex absolute font-bold top-1/4 left-1/2 -translate-x-1/2 text-center'>
          <button className='bg-white text-xl p-1 rounded-md shadow hover:bg-gray-300 transition-colors hover:shadow-md'>
            <RouterLink to={`/tournament/${id}`}>
              Details
            </RouterLink>
          </button>
          <button 
            disabled={!canRegister} 
            onClick={() => handleRegister()} 
            className={`${canRegister ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md transition-colors' : 'bg-gray-500 text-white'} p-1 text-xl rounded-md shadow`}>
              {participants &&
                participants.includes(currentUserUID) ? 'Registered' : `$${registration_fee} Register`
              }
          </button>
        </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-700 mr-1">
            <RouterLink to={`/tournament/${id}`}>
              {name}
            </RouterLink>
          </h3>
        </div>
        <div className='flex gap-2 flex-row'>
          <UserGroupIcon className='h-5 w-5' aria-hidden='true'/>
          <p className="text-sm font-medium text-gray-900">
            {participants ? participants.length : '0'}/{max_participants}
          </p>
        </div>
      </div>
      <div className='flex gap-2 flex-row justify-between'>
        <div className='flex flex-row gap-2'>
          <CalendarDaysIcon className='h-5 w-5' aria-hidden='true'/>
          <p className="text-sm font-medium text-gray-900">{new_start_date}</p>
        </div>
          <p className="text-sm font-medium text-gray-900">-</p>
          <p className="text-sm font-medium text-gray-900">{new_end_date}</p>
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