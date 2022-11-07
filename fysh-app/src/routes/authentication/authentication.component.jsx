import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';

import { Box } from '@mui/material';

//import './authentication.styles.scss';

const Authentication = () => {

    return(
        <Box className='authentication-container'
        sx={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            margin: 8
        }}
        >
            <SignInForm />
            <SignUpForm />
        </Box>
    )
}

export default Authentication;