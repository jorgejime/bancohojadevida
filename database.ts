import type { PersonalData, ProfessionalExperience, AcademicRecord, Language, Tool, Reference, UserSettings } from './types';

const DB_PREFIX = 'usm_cv_bank_';

// Helper to get and parse data from localStorage
const get = async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
        const value = localStorage.getItem(DB_PREFIX + key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
};

// Helper to set and stringify data to localStorage
const set = async <T>(key: string, value: T): Promise<void> => {
    try {
        localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
};

// --- Personal Data ---
const PERSONAL_DATA_KEY = 'personal_data';
export const getPersonalData = () => get<PersonalData>(PERSONAL_DATA_KEY, { fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: '' });
export const savePersonalData = (data: PersonalData) => set(PERSONAL_DATA_KEY, data);

// --- Professional Experience ---
const EXPERIENCES_KEY = 'professional_experiences';
export const getProfessionalExperiences = () => get<ProfessionalExperience[]>(EXPERIENCES_KEY, []);

export const addProfessionalExperience = async (experience: Omit<ProfessionalExperience, 'id'>) => {
    const experiences = await getProfessionalExperiences();
    const newExperience = { ...experience, id: Date.now().toString() };
    await set(EXPERIENCES_KEY, [newExperience, ...experiences]);
};

export const updateProfessionalExperience = async (updatedExperience: ProfessionalExperience) => {
    const experiences = await getProfessionalExperiences();
    const updatedList = experiences.map(exp => exp.id === updatedExperience.id ? updatedExperience : exp);
    await set(EXPERIENCES_KEY, updatedList);
};

export const deleteProfessionalExperience = async (id: string) => {
    const experiences = await getProfessionalExperiences();
    const updatedList = experiences.filter(exp => exp.id !== id);
    await set(EXPERIENCES_KEY, updatedList);
};

// --- Academic Records ---
const ACADEMIC_KEY = 'academic_records';
export const getAcademicRecords = () => get<AcademicRecord[]>(ACADEMIC_KEY, []);

export const addAcademicRecord = async (record: Omit<AcademicRecord, 'id'>) => {
    const records = await getAcademicRecords();
    const newRecord = { ...record, id: Date.now().toString() };
    await set(ACADEMIC_KEY, [newRecord, ...records]);
};

export const updateAcademicRecord = async (updatedRecord: AcademicRecord) => {
    const records = await getAcademicRecords();
    const updatedList = records.map(rec => rec.id === updatedRecord.id ? updatedRecord : rec);
    await set(ACADEMIC_KEY, updatedList);
};

export const deleteAcademicRecord = async (id: string) => {
    const records = await getAcademicRecords();
    const updatedList = records.filter(rec => rec.id !== id);
    await set(ACADEMIC_KEY, updatedList);
};

// --- Languages ---
const LANGUAGES_KEY = 'languages';
export const getLanguages = () => get<Language[]>(LANGUAGES_KEY, []);

export const addLanguage = async (language: Omit<Language, 'id'>) => {
    const languages = await getLanguages();
    const newLanguage = { ...language, id: Date.now().toString() };
    await set(LANGUAGES_KEY, [...languages, newLanguage]);
};

export const deleteLanguage = async (id: string) => {
    const languages = await getLanguages();
    const updatedList = languages.filter(lang => lang.id !== id);
    await set(LANGUAGES_KEY, updatedList);
};


// --- Tools ---
const TOOLS_KEY = 'tools';
export const getTools = () => get<Tool[]>(TOOLS_KEY, []);

export const addTool = async (tool: Omit<Tool, 'id'>) => {
    const tools = await getTools();
    const newTool = { ...tool, id: Date.now().toString() };
    await set(TOOLS_KEY, [...tools, newTool]);
};

export const deleteTool = async (id: string) => {
    const tools = await getTools();
    const updatedList = tools.filter(t => t.id !== id);
    await set(TOOLS_KEY, updatedList);
};

// --- References ---
const REFERENCES_KEY = 'references';
export const getReferences = () => get<Reference[]>(REFERENCES_KEY, []);

export const addReference = async (reference: Omit<Reference, 'id'>) => {
    const references = await getReferences();
    const newReference = { ...reference, id: Date.now().toString() };
    await set(REFERENCES_KEY, [newReference, ...references]);
};

export const updateReference = async (updatedReference: Reference) => {
    const references = await getReferences();
    const updatedList = references.map(r => r.id === updatedReference.id ? updatedReference : r);
    await set(REFERENCES_KEY, updatedList);
};

export const deleteReference = async (id: string) => {
    const references = await getReferences();
    const updatedList = references.filter(r => r.id !== id);
    await set(REFERENCES_KEY, updatedList);
};


// --- Settings ---
const SETTINGS_KEY = 'user_settings';
export const getSettings = () => get<UserSettings>(SETTINGS_KEY, { notifications: { newOpportunities: true } });
export const saveSettings = (settings: UserSettings) => set(SETTINGS_KEY, settings);


// --- Clear All Data ---
export const clearAllData = () => {
    // This is a bit brute-force but effective for this mock setup.
    // In a real app, you'd iterate through keys or have a user-specific object to delete.
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(DB_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
};
