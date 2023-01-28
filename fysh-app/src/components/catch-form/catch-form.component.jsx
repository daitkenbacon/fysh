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
        setIsUploading(true);
        if (!selectedImage) {
            toast.error('Please choose a file before uploading.');
            return;
        }
        const newMetadata = {
            cacheControl: 'public,max-age=300',
            contentType: 'image/jpeg'
        };
        const storageRef = ref(storage, `/catches/${selectedImage.name}`);
        console.log(storageRef);
        uploadString(storageRef, resizedImage, 'data_url', newMetadata).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((URL) => {
                setFormFields({ ...formFields, img: URL})
                setIsUploading(false);
                setIsImageUploaded(true);
            })
        }).catch((err) => console.log(err));
        setIsUploading(false);
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
        <form onSubmit={handleSubmit}>
            <div className='mx-5'>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Brief description
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                    type="text"
                    name="description"
                    maxLength={35}
                    value={description}
                    onChange={handleChange}
                    id="description"
                    className="mb-2 block w-full rounded-md border-gray-300 pl-3 pr-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="My 15lb bass"
                    />
                </div>
            </div>
            <div className='mx-5'>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Size (inches)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                    type="number"
                    name="size"
                    value={Math.abs(size)}
                    onChange={handleChange}
                    id="size"
                    className="mb-2 block w-full rounded-md border-gray-300 pl-3 pr-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="15"
                    />
                </div>
            </div>
            <div className="relative mb-2 mx-5 rounded-md shadow-sm">
                <input
                    className="p-2 block w-full rounded-md border-gray-300 sm:text-sm"
                    required={true}
                    type="file"
                    accept='image/*'
                    onChange={handleFileChange}
                />
            </div>
            
            {selectedImage &&
            <div className='w-full px-5 flex flex-col justify-center content-center items-center'>
                <img className='rounded-lg mx-h-500' src={previewImage} alt='Catch submission' />
            </div>
            }
            {selectedImage &&
            <div className='mx-5'>
                <button onClick={handleUpload} type="button" className="w-full my-2 justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mx-3 sm:w-auto sm:text-sm">
                    {`${isUploading ? 'Uploading...' : 'Upload Image'}`}
                </button>  
            </div>
            }
            
            <div className="bg-gray-50 w-full px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Submit</button>
                <button onClick={() => setOpenModal(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
            </div>
        </form>
    )
}

export default CatchForm;