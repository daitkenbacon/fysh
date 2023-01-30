import React from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Resizer from 'react-image-file-resizer';

import PropTypes from 'prop-types';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { createDocInCollection, storage } from "../../utils/firebase/firebase.utils";
import { ref, uploadBytesResumable, getDownloadURL, updateMetadata, uploadString } from 'firebase/storage';

import './tournament-form.styles.css';

import { useState, useContext } from "react";
import { UserContext } from '../../contexts/user.context';

import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { TournamentsContext } from '../../contexts/tournaments.context';



const TournamentForm = () => {

    const { currentUser, currentUserUID } = useContext(UserContext);
    const { addTournament } = useContext(TournamentsContext);

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
        author: currentUserUID,
        catches: [],
        isOpen: true,
    }

    const [formFields, setFormFields] = useState(defaultFormFields);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [resizedImage, setResizedImage] = useState('');
    const [percent, setPercent] = useState(0);
    const navigate = useNavigate();
    const { name, description, rules, registration_fee, max_participants, author } = formFields;

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

    useEffect(() => {
        if(!selectedImage) {
            setPreviewImage(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreviewImage(objectUrl);
    }, [selectedImage])

    useEffect(() => {
        if(currentUserUID){
            setFormFields({...formFields, author: currentUserUID});
        }
    }, [currentUserUID])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(isUploading) {
            toast.error('Image is still uploading.');
            return;
        }
        if(currentUserUID){
            try{
                setIsLoading(true);
                await createDocInCollection(formFields, 'tournaments');
                addTournament(formFields);
                setFormFields(defaultFormFields);
                setIsLoading(false);
                console.log('Finished uploading: ', formFields);
            } catch(err) {
                console.error(err);
            }
        } else {
            toast.error("You must be logged in to create a tournament!")
        }
    };

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(file, 500, 500, 'jpeg', 100, 0, (uri) => {
            resolve(uri);
            });
    });

    const handleUpload = async () => {
        if (!selectedImage) {
            toast.error('Please choose a file before uploading.');
            return;
        }

        const newMetadata = {
            cacheControl: 'public,max-age=300',
            contentType: 'image/jpeg'
        };
        setIsUploading(true);
        const storageRef = ref(storage, `/tournaments/${selectedImage.name}`);
        console.log(storageRef);
        uploadString(storageRef, resizedImage, 'data_url', newMetadata).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((URL) => {
                setFormFields({ ...formFields, image: URL})
                setIsUploading(false);
            })
        }).catch((err) => console.log(err));
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedImage(undefined);
            return;
        }
        if(file.size > (5 * 1024 * 1024)){
            toast.error('File must be less than 5MB.')
        } else {
            try{
                const uri = await resizeFile(file);
                setResizedImage(uri);
                setSelectedImage(file);
            } catch(err) {
                console.error(err);
            }
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
                    <TextField sx={{input: {color: '#FCFFF5'}}} variant='standard' label='Name' type='text' required onChange={handleChange} max_length={12} name='name' value={name}/>
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
                        {selectedImage &&
                            <Button variant='contained' sx={{width: 150, alignSelf: 'left', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} onClick={handleUpload}>{isUploading ? 'Uploading...' : 'Upload Image'}</Button>
                        }
                        {(percent > 0) && <p>{percent}%</p>}
                    </Box>
                    <Button disabled={isLoading || isUploading} sx={{width: 100, alignSelf: 'center', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} variant='contained' type='submit'>{`${isLoading ? 'Submitting...' : 'Submit'}`}</Button>
                </form>
            </div>
        </div>
    )
}

export default TournamentForm;