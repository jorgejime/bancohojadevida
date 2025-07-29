import React, { useState, useEffect, useCallback } from 'react';
import type { ProfessionalExperience } from '../types';
import * as db from '../database';
import Icon from '../components/Icon';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

interface ExperienceFormProps {
    experience: ProfessionalExperience | null;
    onSave: (experience: Omit<ProfessionalExperience, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<ProfessionalExperience, 'id'>>({
        company: '', role: '', country: '', startDate: '', endDate: null, isCurrent: false, description: ''
    });

    useEffect(() => {
        if (experience) {
            setFormData({ ...experience });
        } else {
            setFormData({ company: '', role: '', country: '', startDate: '', endDate: null, isCurrent: false, description: '' });
        }
    }, [experience]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
             const checked = e.target.checked;
             setFormData(prev => ({ ...prev, isCurrent: checked, endDate: checked ? null : prev.endDate }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <Card title={experience ? 'Editar Experiencia' : 'Agregar Experiencia'}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Empresa</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Cargo</label>
                        <input type="text" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">País</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-gray-700">Fecha de Inicio</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className={formData.isCurrent ? 'opacity-50' : ''}>
                        <label className="block text-sm font-semibold text-gray-700">Fecha de Finalización</label>
                        <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} disabled={formData.isCurrent} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex items-center mt-6">
                        <input id="isCurrent" name="isCurrent" type="checkbox" checked={formData.isCurrent} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-900">¿Es su trabajo actual?</label>
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700">Descripción de funciones</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                 <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
                    <p className="font-bold">Información Importante</p>
                    <p className="text-sm">Por favor, ingrese información veraz y verificable. Se le podrán solicitar soportes que acrediten su experiencia.</p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Guardar
                    </button>
                </div>
            </form>
        </Card>
    );
};


const ExperienceCard: React.FC<{ experience: ProfessionalExperience; onEdit: (id: string) => void; onDelete: (id: string) => void; }> = ({ experience, onEdit, onDelete }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Presente';
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    };

    return (
        <Card title={experience.role} footer={(
            <div className="flex justify-end space-x-2">
                <button onClick={() => onEdit(experience.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                    <Icon name="user" className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(experience.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
                    <Icon name="user" className="h-5 w-5" />
                </button>
            </div>
        )}>
            <p className="text-md text-blue-600 font-semibold mb-1">{experience.company}</p>
            <p className="text-sm text-gray-500">
                {formatDate(experience.startDate)} - {experience.isCurrent ? 'Presente' : formatDate(experience.endDate)}
                <span className="mx-2">·</span>
                {experience.country}
            </p>
            <p className="mt-3 text-gray-700 text-sm leading-relaxed">{experience.description}</p>
            <div className="mt-4">
                <button disabled className="text-sm bg-gray-200 text-gray-500 px-3 py-1 rounded-md cursor-not-allowed flex items-center">
                    <Icon name="user" className="h-4 w-4 mr-2" />
                    Subir Soporte (Próximamente)
                </button>
            </div>
        </Card>
    );
};

const ProfessionalExperiencePage = (): React.ReactNode => {
    const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingExperience, setEditingExperience] = useState<ProfessionalExperience | null>(null);
    const [loading, setLoading] = useState(true);

    const loadExperiences = useCallback(async () => {
        setLoading(true);
        try {
            const data = await db.getProfessionalExperiences();
            setExperiences(data);
        } catch (error) {
            console.error("Error loading professional experiences:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExperiences();
    }, [loadExperiences]);

    const handleAddNew = useCallback(() => {
        setEditingExperience(null);
        setIsFormVisible(true);
    }, []);

    const handleEdit = useCallback((id: string) => {
        const experienceToEdit = experiences.find(exp => exp.id === id);
        if (experienceToEdit) {
            setEditingExperience(experienceToEdit);
            setIsFormVisible(true);
        }
    }, [experiences]);

    const handleDelete = useCallback(async (id: string) => {
        await db.deleteProfessionalExperience(id);
        await loadExperiences();
    }, [loadExperiences]);

    const handleSave = useCallback(async (experienceData: Omit<ProfessionalExperience, 'id'>) => {
        if (editingExperience) {
            await db.updateProfessionalExperience({ ...editingExperience, ...experienceData });
        } else {
            await db.addProfessionalExperience(experienceData);
        }
        await loadExperiences();
        setIsFormVisible(false);
        setEditingExperience(null);
    }, [editingExperience, loadExperiences]);

    const handleCancel = useCallback(() => {
        setIsFormVisible(false);
        setEditingExperience(null);
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">EXPERIENCIA PROFESIONAL</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Icon name="user" className="h-5 w-5 mr-2" />
                        Agregar Experiencia
                    </button>
                )}
            </div>
            
            {isFormVisible && <ExperienceForm experience={editingExperience} onSave={handleSave} onCancel={handleCancel} />}

            <div className="space-y-6">
                {experiences.map(exp => (
                    <ExperienceCard key={exp.id} experience={exp} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
                {experiences.length === 0 && !isFormVisible && (
                    <Card title="Sin Experiencia Profesional">
                        <p className="text-gray-500 text-center py-4">Aún no has agregado ninguna experiencia profesional.</p>
                        <p className="text-sm text-gray-400 text-center mt-1">Haz clic en "Agregar Experiencia" para comenzar.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProfessionalExperiencePage;
