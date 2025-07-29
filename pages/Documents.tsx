import React, { useState, useEffect, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../src/firebase';
import { getAuth } from 'firebase/auth';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

const DocumentsPage = (): React.ReactNode => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<{ name: string, url: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const listDocuments = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const listRef = ref(storage, `users/${userId}/documents`);
            const res = await listAll(listRef);
            const docs = await Promise.all(res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return { name: itemRef.name, url };
            }));
            setDocuments(docs);
        } catch (error) {
            console.error("Error listing documents:", error);
            setError("No se pudieron cargar los documentos.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        listDocuments();
    }, [listDocuments]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("El archivo no debe exceder los 5MB.");
                setFile(null);
            } else if (selectedFile.type !== 'application/pdf') {
                setError("Solo se permiten archivos PDF.");
                setFile(null);
            } else {
                setFile(selectedFile);
                setError(null);
            }
        }
    };

    const handleUpload = () => {
        if (!file || !userId) return;

        const storageRef = ref(storage, `users/${userId}/documents/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
                setError("Error al subir el archivo. Inténtelo de nuevo.");
                setUploading(false);
            },
            () => {
                setUploading(false);
                setFile(null);
                listDocuments();
            }
        );
    };

    const handleDelete = async (docName: string) => {
        if (!userId) return;
        const docRef = ref(storage, `users/${userId}/documents/${docName}`);
        try {
            await deleteObject(docRef);
            listDocuments();
        } catch (error) {
            console.error("Error deleting document:", error);
            setError("No se pudo eliminar el documento.");
        }
    };

    return (
        <div className="space-y-8">
            <Card title="Cargar Documentos de Soporte">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Seleccionar archivo PDF (Máx. 5MB)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="application/pdf"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {uploading && (
                        <div className="w-full bg-gray-200 rounded-full">
                            <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}>
                                {Math.round(progress)}%
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="self-start bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {uploading ? 'Subiendo...' : 'Subir Archivo'}
                    </button>
                </div>
            </Card>

            <Card title="Mis Documentos">
                {loading ? <Spinner /> : (
                    <ul className="space-y-3">
                        {documents.length > 0 ? documents.map(doc => (
                            <li key={doc.name} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                    {doc.name}
                                 </a>
                                <button onClick={() => handleDelete(doc.name)} className="p-2 text-gray-500 hover:text-red-600">
                                    <Icon name="user" className="h-5 w-5" />
                                </button>
                            </li>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No hay documentos subidos.</p>
                        )}
                    </ul>
                )}
            </Card>
        </div>
    );
};

export default DocumentsPage;
