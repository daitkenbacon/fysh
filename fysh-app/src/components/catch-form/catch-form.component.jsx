import { useState, useEffect, useContext } from 'react';
import {toast} from 'react-hot-toast';

import { storage, updateDocInCollection, createDocInCollection } from '../../utils/firebase/firebase.utils';
import { ref, uploadBytesResumable, getDownloadURL, updateMetadata, uploadString } from 'firebase/storage';

import Resizer from 'react-image-file-resizer';

import { Box, Button, TextField } from '@mui/material';
import { UserContext } from '../../contexts/user.context';

const CatchForm = (props) => {

    const { userID, tournament, setOpenModal } = props;
    const { currentUserUID } = useContext(UserContext);

    const defaultFormFields = {
        img: '',
        size: 0,
        description: '',
        time_submitted: new Date(),
        author: userID,
    };
    
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [resizedImage, setResizedImage] = useState('');
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

    useEffect(() => {
        if(currentUserUID){
            setFormFields({...formFields, author: currentUserUID});
        }
    }, [currentUserUID])

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
        const storageRef = ref(storage, `/catches/${selectedImage.name}`);
        console.log(storageRef);
        uploadString(storageRef, resizedImage, 'data_url', newMetadata).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((URL) => {
                setFormFields({ ...formFields, img: URL})
                setIsUploading(false);
                setIsImageUploaded(true);
            })
        }).catch((err) => console.log(err));
    }

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

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(file, 500, 500, 'jpeg', 100, 0, (uri) => {
            resolve(uri);
            });
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(isUploading){
            toast.error('Image is still uploading.');
        }
        else if(!isImageUploaded){
            toast.error('You must upload your image before submitting.');
        }
        else if(currentUserUID){
            try {
                setIsSubmitting(true);
                await createDocInCollection(formFields, 'catches').then(item => {
                    updateDocInCollection('tournaments', tournament.id, {catches: [...tournament.catches, item.data().id] })
                })
                setFormFields(defaultFormFields);
                setOpenModal(false);
                toast.success('Catch submitted!');
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
            {selectedImage &&
                <Button variant='contained' sx={{width: 150, backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, mt: 2 , '&:hover': {backgroundColor: '#576a60'}}} onClick={handleUpload}>Upload file</Button>
            }
            <TextField sx={{mb: 2, label: {color: '#FCFFF5'}, input: {color: '#FCFFF5'}}} type='number' min='0' required variant='outlined' label='Size (inches)' onChange={handleChange} name='size' value={Math.abs(size)}></TextField>
            <TextField sx={{mb: 2, label: {color: '#FCFFF5'}, input: {color: '#FCFFF5'}}} type='text' required variant='outlined' label='Description' onChange={handleChange} name='description' value={description} inputProps={{ maxLength: 50 }}></TextField>
            <Button sx={{width: 100, alignSelf: 'center', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} variant='contained' type='submit'>Submit</Button>
        </form>
    )
}

export default CatchForm;