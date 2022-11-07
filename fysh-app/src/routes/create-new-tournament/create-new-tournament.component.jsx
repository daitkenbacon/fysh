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

import { useState } from "react";

const defaultFormFields = {
        name: '', 
        description: '',
        rules: '',
        registration_fee: 0,
        max_participants: 1,
        start_date: new Date(),
        end_date: new Date(),
        image: ''
    }

const TournamentForm = () => {

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

        try {
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
    };

        const handleChange = (event) => {
            const { name, value } = event.target;

            setFormFields({ ...formFields, [name]: value });
        };

        const [startValue, setStartValue] = useState(null);
        const [endValue, setEndValue] = useState(null);

    return (
        <div className='tournament-form-container'>
            <Typography variant="h2">Create a Tournament</Typography>
            <div >
                <form onSubmit={handleSubmit} className="tournament-form">
                    <TextField variant='standard' label='Name' type='text' required onChange={handleChange} name='name' value={name}/>
                    <TextField variant='standard' label='Description' type='text' required onChange={handleChange} name='description' value={description}/>
                    <TextField variant='standard' label='Rules' type='text' required onChange={handleChange} name='rules' value={rules}/>

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

                    <TextField variant='standard' label='Max participants' type='number' required onChange={handleChange} name='max_participants' value={max_participants}/>
                    <TextField variant='standard' label='Registration fee' type='number' required onChange={handleChange} name='registration_fee' value={registration_fee}/>

                    <Button variant='outlined' type='submit'>Submit</Button>
                </form>
            </div>
        </div>
    )
}

export default TournamentForm;