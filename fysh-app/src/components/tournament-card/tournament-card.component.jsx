import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const TournamentCard = ({tournament}) => {
    const {
        name,
        description,
        registration_fee,
        max_participants,
        participants,
        end_date,
        image
    } = tournament;
  return (
    <Card sx={{ 
        maxWidth: 300,
        borderRadius: 2,
        margin: 2,
        minWidth: 50
         }}>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Details</Button>
        <Button size="small">${registration_fee} Sign Up</Button>
      </CardActions>
    </Card>
  );
}

export default TournamentCard;