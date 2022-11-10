import { useState } from "react";
import './sign-in.styles.css'

import {Button, Box, TextField, Typography} from '@mui/material';

import { signInAuthUserWithEmailAndPassword, signInWithGooglePopup } from "../../utils/firebase/firebase.utils";

import PropTypes from 'prop-types';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import toast, { Toaster } from 'react-hot-toast';

const defaultFormFields = {
        email: '',
        password: '',
    }

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    function Router(props) {
        const { children } = props;
        if (typeof window === 'undefined') {
        return <StaticRouter location="/">{children}</StaticRouter>;
        }

        return <MemoryRouter>{children}</MemoryRouter>;
  }

  const navigate = useNavigate();

  Router.propTypes = {
    children: PropTypes.node,
  };

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await signInAuthUserWithEmailAndPassword(email, password);
            resetFormFields();
            navigate('/tournaments')
        } catch(error) {
            switch(error.code) {
                case 'auth/wrong-password':
                    toast('Incorrect password.');
                    break;
                case 'auth/user-not-found':
                    toast("No user associated with this email.");
                    break;
                default:
                    toast(error);
            }
            
        }
    };

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <Box className='login-form'
        >
            <Toaster/>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="header">
                    <Typography variant="h4">I already have an account</Typography>
                    <Typography variant="subtitle1">Sign up with your email and password:</Typography>
                </div>
                <div className="content">
                    <TextField className="input-field" variant='standard' label='Email' type='email' required onChange={handleChange} name='email' value={email}/>

                    <TextField className="input-field" variant='standard' label='Password' type='password' required onChange={handleChange} name='password' value={password}/>
                </div>
                <div className="action">
                    <Button
                    variant="contained" 
                    type='submit'
                    className='action-button'
                    >Sign in</Button>
                    <Button
                    type='button' 
                    onClick={() => navigate('/signup')}
                    variant="contained"
                    className='action-button'
                    >Register</Button>

                </div>
                
            </form>
        </Box>
    )
}

export default SignInForm;