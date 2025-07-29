import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import { getUserName, logout, getCurrentUserRole } from '../src/auth';
import Icon from './Icon';

const navItems = [
    { to: "/my-profile", iconName: "user", label: "Mi Perfil" },
    { to: "/personal-data", iconName: "user", label: "Datos Personales" },
    { to: "/dashboard/professional-experience", iconName: "user", label: "Experiencia Profesional" },
    { to: "/academic-education", iconName: "user", label: "Formación Académica" },
    { to: "/languages", iconName: "user", label: "Idiomas" },
    { to: "/tool-management", iconName: "user", label: "Manejo de Herramientas" },
    { to: "/references", iconName: "user", label: "Referencias" },
    { to: "/documents", iconName: "user", label: "Documentos" },
    { to: "/settings", iconName: "user", label: "Configuración" },
];

const Sidebar = (): React.ReactNode => {
    const location = useLocation();
    const userName = getUserName();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingRole, setLoadingRole] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            const role = await getCurrentUserRole();
            if (role === 'admin') {
                setIsAdmin(true);
            }
            setLoadingRole(false);
        };
        checkRole();
    }, []);

    const handleLogout = () => {
        logout();
    };

    if (loadingRole) {
        return (
            <div className="flex flex-col w-72 bg-blue-800 text-white shadow-2xl items-center justify-center">
                <p>Cargando menú...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-72 bg-blue-800 text-white shadow-2xl">
            <div className="flex items-center justify-center h-24 border-b-2 border-blue-700">
                <h1 className="text-xl font-bold tracking-wider">Hoja de Vida USM</h1>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        iconName={item.iconName as any} 
                        label={item.label}
                    />
                ))}
                {isAdmin && (
                    <NavItem
                        to="/admin"
                        iconName="user" // Consider adding a specific icon for admin
                        label="Panel de Administrador"
                    />
                )}
            </nav>

            <div className="px-4 py-5 border-t-2 border-blue-700">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Icon name="user" className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">{userName}</p>
                        <a 
                            href="#" 
                            onClick={handleLogout} 
                            className="text-sm text-blue-300 hover:text-red-400 transition-colors"
                        >
                            Cerrar Sesión
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
