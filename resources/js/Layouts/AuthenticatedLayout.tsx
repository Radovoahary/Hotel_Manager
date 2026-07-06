import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    // On utilise directement le type 'PageProps' global automatique de Laravel Breeze
    const { auth } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-[#0B0A11] text-gray-100 font-sans antialiased">
            {/* NAV BAR STYLE STAKENT */}
            <nav className="border-b border-[#1F1D2C] bg-[#12111A]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-400 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
                                </Link>
                            </div>

                            {/* BARRE DE NAVIGATION LARGE (Styles des onglets inspirés de image_ec2c0c.jpg) */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                        route().current('dashboard')
                                            ? 'border-indigo-500 text-white font-semibold'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                    }`}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    href={route('rooms.index')}
                                    active={route().current('rooms.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                        route().current('rooms.index')
                                            ? 'border-indigo-500 text-white font-semibold'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                    }`}
                                >
                                    Gestion des Chambres    
                                </NavLink>

                                <NavLink
                                     href={route('clients.index')}
                                    active={route().current('clients.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                        route().current('clients.index')
                                            ? 'border-indigo-500 text-white font-semibold'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                    }`}
                                >
                                     Gestion des Clients
                                </NavLink>

                                <NavLink
                                    href={route('reservations.index')}
                                    active={route().current('reservations.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                        route().current('reservations.index')
                                            ? 'border-indigo-500 text-white font-semibold'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                    }`}
                                >
                                    Réservations
                                </NavLink>
                            </div>
                        </div>

                        {/* BOUTON PROFIL & DROPDOWN STYLE PREMIUM */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-xl">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-[#1F1D2C] bg-[#1A1926] px-4 py-2 text-sm font-medium leading-4 text-gray-300 shadow-sm transition duration-150 ease-in-out hover:text-white hover:bg-[#222133] hover:border-[#2E2C41] focus:outline-none"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    {/* Menu Déroulant adapté au thème sombre */}
                                    <Dropdown.Content contentClasses="py-1 bg-[#12111A] border border-[#1F1D2C] rounded-xl shadow-2xl">
                                        <Dropdown.Link 
                                            href={route('profile.edit')}
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-300 hover:bg-[#1F1D2C] hover:text-white transition duration-150 ease-in-out"
                                        >
                                            Profile ⚙️
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-rose-400 hover:bg-[#1F1D2C] hover:text-rose-300 transition duration-150 ease-in-out"
                                        >
                                            Log Out ➔
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* MENU BURGER MOBILE */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-[#1F1D2C] hover:text-gray-200 focus:bg-[#1F1D2C] focus:text-gray-200 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* BARRE DE NAVIGATION VERSION MOBILE SOMBRE */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-[#161522] border-b border-[#1F1D2C]'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className={`block w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                route().current('dashboard')
                                    ? 'border-indigo-500 text-white bg-[#1F1D2C]'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#12111A]'
                            }`}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        
                        <ResponsiveNavLink
                            href={route('rooms.index')}
                            active={route().current('rooms.index')}
                            className={`block w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                route().current('rooms.index')
                                    ? 'border-indigo-500 text-white bg-[#1F1D2C]'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#12111A]'
                            }`}
                        >
                            Gestion des Chambres
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route('clients.index')}
                            active={route().current('clients.index')}
                            className={`block w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                route().current('clients.index')
                                    ? 'border-indigo-500 text-white bg-[#1F1D2C]'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#12111A]'
                            }`}
                        > 
                            Gestion des Clients
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                             href={route('reservations.index')}
                            active={route().current('reservations.index')}
                            className={`block w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                route().current('reservations.index')
                                    ? 'border-indigo-500 text-white bg-[#1F1D2C]'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#12111A]'
                            }`}
                        >
                            Réservations    
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-[#1F1D2C] pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink 
                                href={route('profile.edit')}
                                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-[#1F1D2C]"
                            >
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-[#1F1D2C] text-left"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* EN-TÊTE DE PAGE */}
            {header && (
                <header className="bg-[#12111A] border-b border-[#1F1D2C] shadow-lg shadow-black/20">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* ESPACE DE CONTENU PRINCIPAL */}
            <main className="py-6">{children}</main>
        </div>
    );
}