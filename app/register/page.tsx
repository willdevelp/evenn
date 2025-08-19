import React from 'react';
import '../globals.css'
import Register from '@/ui/register'

export default function RegisterPage() {
    return (
        <div className="container mx-auto flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-4">S'inscrire</h1>
            <Register />
        </div>
    )
}