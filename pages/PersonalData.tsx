import React, { useState, useEffect } from 'react';
import type { PersonalData as PersonalDataType } from '../types';
import * as db from '../database';
import Spinner from '../components/Spinner';
import Card from '../components/Card';

const PersonalData = (): React.ReactNode => {
    const [formData, setFormData] = useState<PersonalDataType>({
        fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await db.getPersonalData();
                setFormData(data);
            } catch (error) {
                console.error("Error loading personal data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await db.savePersonalData(formData);
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Card title="Datos Personales">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Nombre Completo</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Email de Contacto</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Dirección</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Ciudad</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">País</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700">Resumen Profesional</label>
                    <textarea name="summary" value={formData.summary} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Describa brevemente su perfil profesional..." />
                </div>
                <div className="mt-8 flex justify-end items-center gap-4">
                    {showSuccess && (
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
                            ¡Guardado con éxito!
                        </div>
                    )}
                    <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300">
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default PersonalData;
