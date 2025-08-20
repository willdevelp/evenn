import '../globals.css'
import React from 'react'
import { LoginForm } from './login';

export default function LoginPage() {
    return (
        <div className="container mx-auto lg:w-1/3 items-center lg:p-4 border rounded mt-20 md:w-full md:p-2 space-y-4">
            <LoginForm />
        </div>
    )
}