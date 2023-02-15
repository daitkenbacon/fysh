import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { LockClosedIcon } from '@heroicons/react/20/solid'

import { Toaster, toast } from 'react-hot-toast';

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth, signInWithGooglePopup } from "../../utils/firebase/firebase.utils";
import { sendEmailVerification } from "firebase/auth";

const defaultFormFields = {
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: 'I love to fysh!',
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/fysh-poc-db.appspot.com/o/users%2Ffysher.png?alt=media&token=19096cde-d632-4ae8-afa8-a46540c365a0',
    }

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;
    const navigate = useNavigate();

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error('passwords do not match');
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);
            await sendEmailVerification(user);
            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
            toast.success(`Email verification sent to ${email}!`);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Cannot create user, email already in use');
        } else {
            toast.error('Could not register user: ', error);
            console.error(error);
        }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
    <>  
      <Toaster/>
      <div className="flex min-h-full items-center bg-gray-100 rounded justify-center py-12 px-8 lg:px-80 lg:py-40 shadow">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
              alt="Fysh.com"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up for a Fysh account
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
            <div>
                <label htmlFor="displayName" className="sr-only">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="displayName"
                  value={displayName}
                  onChange={handleChange}
                  autoComplete="displayName"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Display name"
                />
            </div>
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
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
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
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="text-sm">
              <Link to='/authentication' className="font-medium text-blue-600 hover:text-blue-500">
                Already have an account?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                </span>
                Sign Up
              </button>
                <button 
                onClick={signInWithGoogle}
                className="group mt-1 relative flex w-full justify-center rounded-md border border-transparent bg-azure-500 py-2 px-4 text-sm font-medium text-white hover:bg-azure-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Sign Up with Google
                </button>
            </div>
          </form>
        </div>
      </div>
    </> 
    )
}

export default SignUpForm;