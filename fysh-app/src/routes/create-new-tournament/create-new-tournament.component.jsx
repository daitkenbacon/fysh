import React from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import PropTypes from 'prop-types';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { createDocInCollection } from "../../utils/firebase/firebase.utils";
import { storage } from '../../utils/firebase/firebase.utils';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import './tournament-form.styles.css';

import { useState, useContext } from "react";
import { UserContext } from '../../contexts/user.context';

import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

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
        author: ''
    }

const TournamentForm = () => {

    const { currentUser, currentUserUID } = useContext(UserContext);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [selectedImage, setSelectedImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [percent, setPercent] = useState(0);
    const navigate = useNavigate();
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

    useEffect(() => {
        if(!selectedImage) {
            setPreviewImage(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreviewImage(objectUrl);
    }, [selectedImage])

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(percent > 0 && percent < 100) {
            toast.error('Wait for image to upload before submitting.')
            return;
        }

        if(currentUserUID){
            try {
                setFormFields({...formFields, author: currentUser.uid});
                const res = await createDocInCollection(formFields, 'tournaments');
                // resetFormFields();
                navigate('/tournaments');
            } catch(error) {
                toast.error(error);
                
            }
        } else {
            toast.error("You must be logged in to create a tournament!")
        }

    };

    const handleUpload = () => {
        if (!selectedImage) {
            toast.error('Please choose a file before uploading.');
            return;
        }

        const storageRef = ref(storage, `/tournaments/${selectedImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setPercent(percent);
            },
            (err) => {toast.error(err); console.log(err)},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setFormFields({ ...formFields, image: url});
                })
            }
        )

    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    const handleFileChange = (event) => {
        const image = event.target.files[0];
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedImage(undefined);
            return;
        }
        if(image.size > (5 * 1024 * 1024)){
            toast.error('File must be less than 5MB.')
        } else {
            setSelectedImage(image);
        }
    }

    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);

    return (
        <div>
            <div className='header'>
            <Typography sx={{
                fontFamily: 'Abril Fatface, cursive',
                color: '#d1dbbd',
                fontSize: '5vw',
                textShadow: '2px 2px 5px #193441'
            }} variant='h1'
            >
                Create a Tournament
                </Typography>
            </div>
            <div className='tournament-form-container'>
                <Toaster/>
                <form onSubmit={handleSubmit} className="tournament-form">
                    <TextField sx={{input: {color: '#FCFFF5'}}} variant='standard' label='Name' type='text' required onChange={handleChange} name='name' value={name}/>
                    <TextField multiline variant='standard' label='Description' type='text' required onChange={handleChange} name='description' value={description}/>
                    <TextField multiline variant='standard' label='Rules' type='text' required onChange={handleChange} name='rules' value={rules}/>
                    {/* <TextField variant='standard' label='Image URL' type='text' required onChange={handleChange} name='image' value={image}/> */}
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
                    {selectedImage && <img src={previewImage}/>}
                    <Box>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{width: 150, alignSelf: 'left', backgroundColor: '#91AA9D', color: '#FCFFF5', mr: 2, mb: 2, '&:hover': {backgroundColor: '#576a60'}}}
                            >
                                Add an image
                                <input
                                    type="file"
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    hidden
                                />
                        </Button>
                        {selectedImage && (percent < 100) &&
                            <Button variant='contained' sx={{width: 150, alignSelf: 'left', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} onClick={handleUpload}>Upload file</Button>
                        }
                        {percent>0 && <p>{percent}%</p>}
                    </Box>
                    <Button sx={{width: 100, alignSelf: 'center', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} variant='contained' type='submit'>Submit</Button>
                </form>
            </div>
        </div>
    )
}

export default TournamentForm;