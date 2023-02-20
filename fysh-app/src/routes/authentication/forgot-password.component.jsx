import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { triggerPasswordReset } from "../../utils/firebase/firebase.utils";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;

    setEmail(value);
    console.log(email);
  };

  return (
    <>
      <Toaster />
      <div className="flex min-h-full items-center rounded justify-center px-8 lg:px-80 lg:py-20">
        <div className="flex flex-col min-h-full bg-gray-100 items-center rounded justify-center py-6 px-8 lg:px-80 lg:py-40 shadow">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
              alt="Fysh.com"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Reset your password
            </h2>
          </div>
          <form className="mt-8 space-y-6 w-full">
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
            </div>

            <div>
              <button
                type="button"
                onClick={() => triggerPasswordReset(email)}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Reset Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
