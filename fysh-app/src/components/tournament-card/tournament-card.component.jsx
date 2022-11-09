import * as React from 'react';

import './tournament-card.styles.css'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';

import PropTypes from 'prop-types';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
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
    id
  } = tournament;

  const navigate = useNavigate();

  const new_end_date = new Date(end_date.seconds * 1000).toLocaleDateString('en-US');

  function Router(props) {
    const { children } = props;
    if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>;
    }

    return <MemoryRouter>{children}</MemoryRouter>;
  }

    Router.propTypes = {
    children: PropTypes.node,
  };

  return (
    <Card sx={{ 
        width: 325,
        borderRadius: 2,
        margin: 2,
        minWidth: 50,
        backgroundColor: '#193441',
        boxShadow: '3px 3px 10px'
         }}>
      <CardMedia
        component="img"
        height="160"
        image={image}
        alt={name}
      />
      <CardContent sx={{
        color: '#d1dbbd;'
      }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="#FCFFF5">
          {description}
        </Typography>
        <div className='card-info'>
          <div className='date-info'>
            <CalendarMonthIcon />
            <Typography variant='subtitle1'>{new_end_date}</Typography>
          </div>
          <div className='participants-info'>
            <Typography>{participants ? participants.length : '0'}/{max_participants}</Typography> 
            <GroupsIcon/>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate(`/tournament/${tournament.id}`, tournament.id)} sx={{color: '#FCFFF5'}} size="small">Details</Button>
        <Button sx={{backgroundColor: '#3E606F'}} variant='contained' size="small">${registration_fee} Sign Up</Button>
      </CardActions>
    </Card>
  );
}

export default TournamentCard;