import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserName } from '../auth';
import * as db from '../database';
import Icon from '../components/Icon';
import Spinner from '../components/Spinner';
import Card from '../components/Card';

const profileSections = [
    { to: "/personal-data", iconName: "user", label: "Datos Personales" },
    { to: "/dashboard/professional-experience", iconName: "user", label: "Experiencia Profesional" },
    { to: "/academic-education", iconName: "user", label: "Formación Académica" },
    { to: "/languages", iconName: "user", label: "Idiomas" },
    { to: "/tool-management", iconName: "user", label: "Manejo de Herramientas" },
    { to: "/references", iconName: "user", label: "Referencias" },
];

const ProfileLinkCard: React.FC<{ to: string, iconName: any, label: string }> = ({ to, iconName, label }) => (
    <Link to={to} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center">
        <div className="text-blue-600 mb-4 p-3 bg-blue-100 rounded-full">
            <Icon name={iconName} className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">Gestionar sección</p>
    </Link>
);

const MyProfile = (): React.ReactNode => {
    const userName = getUserName();
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculateProgress = async () => {
            setLoading(true);
            try {
                let completedCount = 0;
                const totalSections = profileSections.length;

                const personalData = await db.getPersonalData();
                if (personalData.fullName && personalData.email) completedCount++;
                
                const experiences = await db.getProfessionalExperiences();
                if (experiences.length > 0) completedCount++;

                const academics = await db.getAcademicRecords();
                if (academics.length > 0) completedCount++;

                const languages = await db.getLanguages();
                if (languages.length > 0) completedCount++;

                const tools = await db.getTools();
                if (tools.length > 0) completedCount++;

                const references = await db.getReferences();
                if (references.length > 0) completedCount++;

                setCompletionPercentage(Math.round((completedCount / totalSections) * 100));
            } catch (error) {
                console.error("Error calculating profile progress:", error);
            } finally {
                setLoading(false);
            }
        };

        calculateProgress();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-8">
            <Card title={`Bienvenido, ${userName}`}>
                <p className="text-gray-600 mb-4">
                    Este es tu centro de perfil. Completa todas las secciones para tener un perfil atractivo para los reclutadores.
                </p>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-md font-semibold text-gray-700">Progreso del Perfil</span>
                        <span className="text-md font-bold text-blue-600">{completionPercentage}% Completo</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3.5 shadow-inner">
                        <div 
                            className="bg-blue-500 h-3.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profileSections.map(section => (
                    <ProfileLinkCard key={section.to} to={section.to} iconName={section.iconName} label={section.label} />
                ))}
            </div>
        </div>
    );
};

export default MyProfile;
