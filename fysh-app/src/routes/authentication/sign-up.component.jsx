import SignUpForm from '../../components/sign-up-form/sign-up-form.component';

import { Box } from '@mui/material';

//import './authentication.styles.scss';

const SignUp = () => {

    return(
        <Box className='authentication-container'
        sx={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            margin: 8
        }}
        >
            <SignUpForm />
        </Box>
    )
}

export default SignUp;