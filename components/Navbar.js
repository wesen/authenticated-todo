import React from 'react';
import {useUser} from "@auth0/nextjs-auth0";
import Link from 'next/link'

function LoginButtons() {
    const {user, error, isLoading} = useUser()
    if (isLoading) return <div className='flex'>Loading...</div>
    if (error) return <div className='flex'>{error.message}</div>

    if (user) {
        return (<div className='flex'>
            <Link href='/api/auth/logout'><a className='rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4'>Logout</a></Link>
        </div>)
    } else {
        return <div className="flex">
            <Link href='/api/auth/login'><a className='rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4'>Login</a></Link>
        </div>
    }
}

function Navbar(props) {
    return (
        <nav className='flex justify-between items-center py-4'>
            <p className='text-2xl font-bold text-grey-800'>My Todos</p>
            <LoginButtons/>
        </nav>
    );
}

export default Navbar;