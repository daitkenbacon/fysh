import { TextField } from "@mui/material";

const FormInput = ({ label, ...otherProps }) => {
    return (
        <div className='group'>
            <TextField id="outlined-basic" label={label} variant="standard" {...otherProps} />
        </div>
    )
}

export default FormInput;