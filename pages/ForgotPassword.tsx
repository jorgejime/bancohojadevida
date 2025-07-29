import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../src/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = (): React.ReactNode => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage({ type: 'success', text: 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.' });
            setEmail('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">¿Olvidaste tu contraseña?</h1>
                    <p className="mt-2 text-gray-600">Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {message.text && (
                        <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message.text}
                        </p>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Volver al inicio de sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
