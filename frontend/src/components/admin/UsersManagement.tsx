import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/admin';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { usersService } from '../../services/api';
import { toast } from 'sonner';

export default function UsersManagement() {
  const { users, loadUsers, adminUser } = useAdmin();

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId: string | undefined, userName: string) => {
    if (!userId || userId === adminUser?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${userName}?`)) {
      try {
        await usersService.delete(userId);
        toast.success('Usuario eliminado correctamente');
        await loadUsers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar el usuario');
      }
    }
  };

  const customers = users.filter(u => u.role === 'cliente');
  const admins = users.filter(u => u.role === 'administrador');

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#386273] mb-6">Gestión de Usuarios</h1>

        {/* Administrators */}
        <div className="bg-white border-2 border-[#B6E1F2] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-[#386273] mb-4">
            Administradores ({admins.length})
          </h2>
          {admins.length === 0 ? (
            <p className="text-gray-500">No hay administradores</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-[#B6E1F2]">
                  <tr>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Nombre</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Rol</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{user.nombre || user.name}</td>
                      <td className="py-3 px-4 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="default">Administrador</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                        onClick={() => handleDelete(user.id, user.nombre || user.name || 'Usuario')}
                          disabled={user.id === adminUser?.id}
                          className="border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customers */}
        <div className="bg-white border-2 border-[#B6E1F2] rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#386273] mb-4">
            Clientes ({customers.length})
          </h2>
          {customers.length === 0 ? (
            <p className="text-gray-500">No hay clientes registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-[#B6E1F2]">
                  <tr>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Nombre</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Teléfono</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Rol</th>
                    <th className="text-left py-3 px-4 text-[#386273] font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{user.nombre || user.name}</td>
                      <td className="py-3 px-4 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-sm">{user.telefono || user.phone || '-'}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="default">Cliente</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                        onClick={() => handleDelete(user.id, user.nombre || user.name || 'Usuario')}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
