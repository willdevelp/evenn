import React from 'react';
import '../globals.css'
import { ProfileForm } from './register';

export default function RegisterPage() {
    return (
        <div className=' md:px-2'>
            <div className="container mx-auto lg:w-1/3 items-center lg:p-4 border rounded mt-14 md:w-full md:p-2">
            <h1 className="text-3xl font-bold mb-4 text-center">{"S'inscrire"}</h1>
            <ProfileForm />
        </div>
        </div>
    )
}