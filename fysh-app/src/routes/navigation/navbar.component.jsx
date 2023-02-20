import { useContext, Fragment, useState, useEffect } from "react";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import PropTypes from "prop-types";
import {
  Link as RouterLink,
  MemoryRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";

import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../utils/firebase/firebase.utils";

const Navbar = () => {
  const { currentUser, currentUserName, currentUserDoc } =
    useContext(UserContext);
  const routerLocation = useLocation();

  const signOutHandler = async () => {
    await signOutUser();
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [navigation, setNavigation] = useState([
    {
      name: "Dashboard",
      href: "dashboard",
      current: routerLocation.pathname === "/dashboard",
    },
    {
      name: "Tournaments",
      href: "tournaments",
      current: routerLocation.pathname === "/tournaments",
    },
    {
      name: "New",
      href: "new-tournament",
      current: routerLocation.pathname === "/new-tournament",
    },
  ]);

  useEffect(() => {
    setNavigation([
      {
        name: "Dashboard",
        href: "dashboard",
        current: routerLocation.pathname === "/dashboard",
      },
      {
        name: "Tournaments",
        href: "tournaments",
        current: routerLocation.pathname === "/tournaments",
      },
      {
        name: "New",
        href: "new-tournament",
        current: routerLocation.pathname === "/new-tournament",
      },
    ]);
  }, [routerLocation, currentUser]);

  function Router(props) {
    const { children } = props;
    if (typeof window === "undefined") {
      return <StaticRouter location="/">{children}</StaticRouter>;
    }

    return <MemoryRouter>{children}</MemoryRouter>;
  }

  Router.propTypes = {
    children: PropTypes.node,
  };

  return (
    <>
      <Disclosure as="nav" className="bg-leaf-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <RouterLink to="/">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500"
                        alt="Fysh logo"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500"
                        alt="Fysh logo"
                      />
                    </RouterLink>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => {
                        return (
                          <RouterLink
                            key={item.name}
                            to={`/${item.href}`}
                            className={classNames(
                              item.current
                                ? "bg-leaf-900 text-white"
                                : "text-gray-100 hover:bg-leaf-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </RouterLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <p className="hidden sm:ml-6 sm:block text-white cursor-default">
                  {currentUser && currentUserDoc && currentUserDoc.displayName}
                </p>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex rounded-full bg-leaf-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`${
                            currentUserDoc
                              ? currentUserDoc.profilePicture
                              : "https://firebasestorage.googleapis.com/v0/b/fysh-poc-db.appspot.com/o/users%2Ffysher.png?alt=media&token=19096cde-d632-4ae8-afa8-a46540c365a0"
                          }`}
                          alt="Avatar preview"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {currentUser && (
                          <div>
                            <Menu.Item>
                              {({ active }) => (
                                <RouterLink
                                  to="/account"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Settings
                                </RouterLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <RouterLink
                                  to="/"
                                  onClick={() => signOutHandler()}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Sign out
                                </RouterLink>
                              )}
                            </Menu.Item>
                          </div>
                        )}
                        {!currentUser && (
                          <div>
                            <Menu.Item>
                              {({ active }) => (
                                <RouterLink
                                  to="/authentication"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Sign in
                                </RouterLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <RouterLink
                                  to="/signup"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Create an account
                                </RouterLink>
                              )}
                            </Menu.Item>
                          </div>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <RouterLink key={item.name} to={item.href}>
                    <Disclosure.Button
                      key={item.name}
                      as="div"
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </RouterLink>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Outlet />
    </>
  );
};
export default Navbar;
