import { db } from './src/firebase';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { PersonalData, ProfessionalExperience, AcademicRecord, Language, Tool, Reference, UserSettings } from './types';

// Helper to get the current user's UID
const getCurrentUserId = (): string | null => {
    const auth = getAuth();
    return auth.currentUser ? auth.currentUser.uid : null;
};

// --- Personal Data ---
export const getPersonalData = async (): Promise<PersonalData> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'users', userId, 'data', 'personal');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as PersonalData : { fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: '' };
};

export const savePersonalData = async (data: PersonalData) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'users', userId, 'data', 'personal');
    await setDoc(docRef, data, { merge: true });
};

// --- Professional Experience ---
const getExperiencesCollection = () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    return collection(db, 'users', userId, 'professional_experiences');
};

export const getProfessionalExperiences = async (): Promise<ProfessionalExperience[]> => {
    const q = query(getExperiencesCollection());
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProfessionalExperience));
};

export const addProfessionalExperience = async (experience: Omit<ProfessionalExperience, 'id'>) => {
    await addDoc(getExperiencesCollection(), experience);
};

export const updateProfessionalExperience = async (updatedExperience: ProfessionalExperience) => {
    const { id, ...data } = updatedExperience;
    const docRef = doc(db, 'users', getCurrentUserId()!, 'professional_experiences', id);
    await updateDoc(docRef, data);
};

export const deleteProfessionalExperience = async (id: string) => {
    const docRef = doc(db, 'users', getCurrentUserId()!, 'professional_experiences', id);
    await deleteDoc(docRef);
};

// --- Academic Records ---
const getAcademicCollection = () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    return collection(db, 'users', userId, 'academic_records');
};

export const getAcademicRecords = async (): Promise<AcademicRecord[]> => {
    const q = query(getAcademicCollection());
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicRecord));
};

export const addAcademicRecord = async (record: Omit<AcademicRecord, 'id'>) => {
    await addDoc(getAcademicCollection(), record);
};

export const updateAcademicRecord = async (updatedRecord: AcademicRecord) => {
    const { id, ...data } = updatedRecord;
    const docRef = doc(db, 'users', getCurrentUserId()!, 'academic_records', id);
    await updateDoc(docRef, data);
};

export const deleteAcademicRecord = async (id: string) => {
    const docRef = doc(db, 'users', getCurrentUserId()!, 'academic_records', id);
    await deleteDoc(docRef);
};

// --- Languages ---
const getLanguagesCollection = () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    return collection(db, 'users', userId, 'languages');
};

export const getLanguages = async (): Promise<Language[]> => {
    const q = query(getLanguagesCollection());
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Language));
};

export const addLanguage = async (language: Omit<Language, 'id'>) => {
    await addDoc(getLanguagesCollection(), language);
};

export const deleteLanguage = async (id: string) => {
    const docRef = doc(db, 'users', getCurrentUserId()!, 'languages', id);
    await deleteDoc(docRef);
};

// --- Tools ---
const getToolsCollection = () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    return collection(db, 'users', userId, 'tools');
};

export const getTools = async (): Promise<Tool[]> => {
    const q = query(getToolsCollection());
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
};

export const addTool = async (tool: Omit<Tool, 'id'>) => {
    await addDoc(getToolsCollection(), tool);
};

export const deleteTool = async (id: string) => {
    const docRef = doc(db, 'users', getCurrentUserId()!, 'tools', id);
    await deleteDoc(docRef);
};

// --- References ---
const getReferencesCollection = () => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    return collection(db, 'users', userId, 'references');
};

export const getReferences = async (): Promise<Reference[]> => {
    const q = query(getReferencesCollection());
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reference));
};

export const addReference = async (reference: Omit<Reference, 'id'>) => {
    await addDoc(getReferencesCollection(), reference);
};

export const updateReference = async (updatedReference: Reference) => {
    const { id, ...data } = updatedReference;
    const docRef = doc(db, 'users', getCurrentUserId()!, 'references', id);
    await updateDoc(docRef, data);
};

export const deleteReference = async (id: string) => {
    const docRef = doc(db, 'users', getCurrentUserId()!, 'references', id);
    await deleteDoc(docRef);
};

// --- Settings ---
export const getSettings = async (): Promise<UserSettings> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'users', userId, 'data', 'settings');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserSettings : { notifications: { newOpportunities: true } };
};

export const saveSettings = async (settings: UserSettings) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'users', userId, 'data', 'settings');
    await setDoc(docRef, settings, { merge: true });
};

// --- Clear All Data (Not recommended for Firestore, handle deletion server-side or with care) ---
export const clearAllData = () => {
    console.warn("clearAllData is not implemented for Firestore and should be handled with care, possibly in a server-side environment.");
    // In a real app, you might have a cloud function to delete user data.
    // For now, this function does nothing to prevent accidental data loss.
};

