import { useState } from "react";
import './sign-in-form.styles.css';

import {Button, Box, TextField, Typography} from '@mui/material';

import { signInAuthUserWithEmailAndPassword, signInWithGooglePopup } from "../../utils/firebase/firebase.utils";

import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

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

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <Box 
        sx={{
            '& > :not(style)': {m: 1, width: '25ch'},
        }}
        >
            <Typography variant="h4">I already have an account</Typography>
            <Typography variant="subtitle1">Sign up with your email and password:</Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">

                <TextField variant='standard' label='Email' type='email' required onChange={handleChange} name='email' value={email}/>

                <TextField variant='standard' label='Password' type='password' required onChange={handleChange} name='password' value={password}/>

                <Button 
                sx={{
                    mt: 1,
                    justifySelf: 'center'
                }}
                variant="contained" 
                type='submit'
                >Sign in</Button>
                <Button
                sx={{
                    mt: 2
                }}
                type='button' 
                onClick={signInWithGoogle}
                variant="outlined"
                >Sign in with Google</Button>
                
            </form>
        </Box>
    )
}

export default SignInForm;