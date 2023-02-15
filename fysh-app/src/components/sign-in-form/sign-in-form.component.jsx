import { useState, useContext } from "react";

import { signInAuthUserWithEmailAndPassword, signInWithGooglePopup } from "../../utils/firebase/firebase.utils";

import { LockClosedIcon } from '@heroicons/react/20/solid'

import PropTypes from 'prop-types';
import { Link, MemoryRouter, useNavigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { UserContext } from "../../contexts/user.context";

import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from "react";

const defaultFormFields = {
        email: '',
        password: '',
    }

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const { currentUser } = useContext(UserContext);

    function Router(props) {
        const { children } = props;
        if (typeof window === 'undefined') {
        return <StaticRouter location="/">{children}</StaticRouter>;
        }

        return <MemoryRouter>{children}</MemoryRouter>;
  }

  useEffect(() => {
    if(currentUser){
      navigate('/');
      console.error('You are already signed in!');
    }
  }, [formFields])

  const navigate = useNavigate();

  Router.propTypes = {
    children: PropTypes.node,
  };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await signInAuthUserWithEmailAndPassword(email, password);
            if(res){
              navigate('/tournaments');
            }
        } catch(error) {
            switch(error.code) {
                case 'auth/wrong-password':
                    toast('Incorrect password.');
                    break;
                case 'auth/user-not-found':
                    toast("No user associated with this email.");
                    break;
                case 'auth/too-many-requests':
                    toast('Too many login requests. Account temporarily disabled.');
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
    <>
      <Toaster />
      <div className="flex min-h-full items-center bg-gray-100 rounded justify-center py-6 px-2 lg:px-80 lg:py-40 shadow">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
              alt="Fysh.com"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to='/forgot-password' className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
                <button 
                onClick={signInWithGoogle}
                className="group mt-1 relative flex w-full justify-center rounded-md border border-transparent bg-azure-500 py-2 px-4 text-sm font-medium text-white hover:bg-azure-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Sign in with Google
                </button>
            </div>
            <div className="text-sm text-center">
                <Link to='/signup' className="font-medium text-blue-600 hover:text-blue-500">
                  Don't have an account?
                </Link>
              </div>
          </form>
        </div>
      </div>
    </> 
    )
}

export default SignInForm;

//  <Box className='login-form'
//         >
//             <Toaster/>
//             <form onSubmit={handleSubmit} noValidate autoComplete="off">
//                 <div className="header">
//                     <Typography variant="h4">I already have an account</Typography>
//                     <Typography variant="subtitle1">Sign up with your email and password:</Typography>
//                 </div>
//                 <div className="content">
//                     <TextField className="input-field" variant='standard' label='Email' type='email' required onChange={handleChange} name='email' value={email}/>

//                     <TextField className="input-field" variant='standard' label='Password' type='password' required onChange={handleChange} name='password' value={password}/>
//                 </div>
//                 <div className="action">
//                     <Button
//                     variant="contained" 
//                     type='submit'
//                     className='action-button'
//                     >Sign in</Button>
//                     <Button
//                     type='button' 
//                     onClick={() => navigate('/signup')}
//                     variant="contained"
//                     className='action-button'
//                     >Register</Button>

//                 </div>
                
//             </form>
//         </Box>