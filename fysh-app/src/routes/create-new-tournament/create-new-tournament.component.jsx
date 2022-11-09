import React from 'react';
import { Button, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { createDocInCollection } from "../../utils/firebase/firebase.utils";

import './tournament-form.styles.css';

import { useState, useContext } from "react";
import { UserContext } from '../../contexts/user.context';

const defaultFormFields = {
        name: '', 
        description: '',
        rules: '',
        registration_fee: 0,
        max_participants: 1,
        participants: [],
        start_date: new Date(),
        end_date: new Date(),
        image: '',
        author: null
    }

const TournamentForm = () => {

    const { currentUser } = useContext(UserContext);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { name, description, rules, registration_fee, max_participants, start_date, end_date, image } = formFields;

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

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(currentUser){
            try {
                setFormFields({...formFields, author_id: currentUser.uid})
                const res = await createDocInCollection(formFields, 'tournaments');
                console.log(res);
                resetFormFields();
            } catch(error) {
                switch(error.code) {
                    case 'auth/wrong-password':
                        alert('Incorrect password.');
                        break;
                    case 'auth/user-not-found':
                        alert("No user associated with this email.");
                        break;
                    default:
                        console.log(error);
                }
                
            }
        } else {
            alert("You must be logged in to create a tournament!")
        }

    };

        const handleChange = (event) => {
            const { name, value } = event.target;

            setFormFields({ ...formFields, [name]: value });
        };

        const [startValue, setStartValue] = useState(null);
        const [endValue, setEndValue] = useState(null);

    return (
        <div>
            <div className='header'>
            <Typography sx={{
                fontFamily: 'Abril Fatface, cursive',
                color: '#d1dbbd',
                fontSize: '5vw'
            }} variant='h1'
            >
                Create a Tournament
                </Typography>
            </div>
            <div className='tournament-form-container'>
                <form onSubmit={handleSubmit} className="tournament-form">
                    <TextField sx={{input: {color: '#FCFFF5'}}} variant='standard' label='Name' type='text' required onChange={handleChange} name='name' value={name}/>
                    <TextField multiline variant='standard' label='Description' type='text' required onChange={handleChange} name='description' value={description}/>
                    <TextField multiline variant='standard' label='Rules' type='text' required onChange={handleChange} name='rules' value={rules}/>
                    <TextField variant='standard' label='Image URL' type='text' required onChange={handleChange} name='image' value={image}/>
                    <TextField sx={{width: '150px'}} variant='outlined' label='Max participants' type='number' required onChange={handleChange} name='max_participants' value={max_participants}/>
                    <TextField sx={{width: '150px'}} variant='outlined' label='Registration fee' type='number' required onChange={handleChange} name='registration_fee' value={registration_fee}/>
                    <div className='date-forms'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={startValue}
                                name="start_date"
                                type="date"
                                onChange={(newValue) => {
                                    setStartValue(newValue);
                                    }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endValue}
                                name="end_date"
                                onChange={(newValue) => {
                                    setEndValue(newValue);
                                    }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <Button sx={{width: 100, alignSelf: 'center', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2}} variant='contained' type='submit'>Submit</Button>
                </form>
            </div>
        </div>
    )
}

export default TournamentForm;