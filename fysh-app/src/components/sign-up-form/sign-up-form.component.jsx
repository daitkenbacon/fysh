import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import {Box, Button, Typography} from '@mui/material';
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from 'react-hot-toast';

import './sign-up-form.styles.css';

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";

const defaultFormFields = {
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;
    const navigate = useNavigate();

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast('passwords do not match');
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);

            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
            navigate('/tournaments');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast('Cannot create user, email already in use');
        } else {
            console.log('user creation encountered an error', error);
        }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <Box 
        className='signup-form'
        sx={{
            justifyContent: "center",
            justifyItems: "center",
            alignItems: "center"
        }} 
        >
            <Toaster />
            <form onSubmit={handleSubmit}>
                <div className="header">
                    <Typography variant="h4">Don't have an account?</Typography>
                    <Typography variant="subtitle1">Sign up with your email and password:</Typography>
                </div>
                <div className='content'>
                    <FormInput label='Display Name' type='text' required onChange={handleChange} name='displayName' value={displayName}/>

                    <FormInput label='Email' type='email' required onChange={handleChange} name='email' value={email}/>

                    <FormInput label='Password' type='password' required onChange={handleChange} name='password' value={password}/>

                    <FormInput label='Confirm Password' type='password' required onChange={handleChange} name='confirmPassword' value={confirmPassword}/>
                </div>
                <div className="action">
                    <Button className="action-button" sx={{mt: 1}} variant="contained" type='submit'>Sign up</Button>
                </div>
            </form>
        </Box>
    )
}

export default SignUpForm;