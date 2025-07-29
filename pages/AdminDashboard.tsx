import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

interface User {
  id: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId: string, currentRole: string) => {
    // In a real application, you would typically use Cloud Functions
    // for sensitive operations like changing user roles to ensure security.
    // This is a simplified example for demonstration.
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    if (window.confirm(`¿Está seguro de cambiar el rol del usuario ${userId} a ${newRole}?`)) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { role: newRole });
        console.log(`Rol del usuario ${userId} cambiado a ${newRole}`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error changing user role:", error);
        alert("Error al cambiar el rol del usuario.");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
     // In a real application, deleting a user and all their associated data
     // should be handled carefully, preferably using Cloud Functions
     // to ensure data consistency and security.
    if (window.confirm(`¿Está seguro de eliminar al usuario ${userId}? Esta acción es irreversible.`)) {
      try {
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);
        console.log(`Usuario ${userId} eliminado.`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
         alert("Error al eliminar el usuario.");
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Card title="Panel de Administrador - Usuarios Registrados">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID de Usuario</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-sm text-gray-700 break-all">{user.id}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{user.email}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{user.role}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  <button
                    onClick={() => handleChangeRole(user.id, user.role)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-blue-600"
                  >
                    Cambiar Rol
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                     className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AdminDashboard;
