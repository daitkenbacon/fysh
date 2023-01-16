import { useState, useEffect } from 'react';
import {toast} from 'react-hot-toast';

import { storage, updateDocInCollection, createDocInCollection } from '../../utils/firebase/firebase.utils';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { Box, Button, TextField } from '@mui/material';

const CatchForm = (props) => {

    const { userID, tournament, setOpenModal } = props;

    const defaultFormFields = {
        img: '',
        size: 0,
        description: '',
        time_submitted: new Date(),
        author: userID,
    };
    
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [percent, setPercent] = useState(0);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    
    const { size, description, } = formFields;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    useEffect(() => {
        if(!selectedImage) {
            setPreviewImage(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreviewImage(objectUrl);
    }, [selectedImage])

    const handleUpload = () => {
        if (!selectedImage) {
            toast.error('Please choose a file before uploading.');
            return;
        }

        const storageRef = ref(storage, `/catches/${selectedImage.name}`);
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
                    setFormFields({ ...formFields, img: url});
                    setIsImageUploaded(true);
                })
            }
        )

    }

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

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(percent > 0 && percent < 100) {
            toast.error('Wait for image to upload before submitting.')
            return;
        }

        if(!isImageUploaded){
            toast.error('You must upload your image before submitting.');
            return;
        }

        if(userID){
            try {
                setFormFields({...formFields, author: userID});
                await createDocInCollection(formFields, 'catches').then(item => {
                    updateDocInCollection('tournaments', tournament.id, {catches: [...tournament.catches, item.data().id] })
                })
                resetFormFields();
                setOpenModal(false);
            } catch(error) {
                toast.error(error);
            }
        } else {
            toast.error("You must be logged in to submit a catch!")
        }

    };

    return (
        <form className='catch-modal-form' onSubmit={handleSubmit}>
            <Button
                variant="contained"
                component="label"
                sx={{width: 150, backgroundColor: '#91AA9D', color: '#FCFFF5', mr: 2, mb: 2, '&:hover': {backgroundColor: '#576a60'}}}
            >
                Add an image
                <input
                    required={true}
                    type="file"
                    accept='image/*'
                    onChange={handleFileChange}
                    hidden
                />
            </Button>
            {selectedImage &&
                <img width='300px' src={previewImage} alt='Catch submission' />
            }
            {selectedImage && (percent < 100) &&
                <Button variant='contained' sx={{width: 150, backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, mt: 2 , '&:hover': {backgroundColor: '#576a60'}}} onClick={handleUpload}>Upload file</Button>
            }
            <TextField sx={{mb: 2, label: {color: '#FCFFF5'}, input: {color: '#FCFFF5'}}} type='number' min='0' required variant='outlined' label='Size (inches)' onChange={handleChange} name='size' value={Math.abs(size)}></TextField>
            <TextField sx={{mb: 2, label: {color: '#FCFFF5'}, input: {color: '#FCFFF5'}}} type='text' required variant='outlined' label='Description' onChange={handleChange} name='description' value={description} inputProps={{ maxLength: 50 }}></TextField>
            <Button sx={{width: 100, alignSelf: 'center', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} variant='contained' type='submit'>Submit</Button>
        </form>
    )
}

export default CatchForm;