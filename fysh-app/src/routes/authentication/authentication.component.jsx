import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import { LockClosedIcon } from '@heroicons/react/20/solid'

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
        </Box>
    )
}

export default Authentication;