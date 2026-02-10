import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useAdmin } from '../../context/admin';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ordersService } from '../../services/api';
import { toast } from 'sonner';
import type { Order } from '../../types';

export default function OrdersManagement() {
  const { orders, loadOrders } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await ordersService.updateStatus(orderId, newStatus);
      toast.success('Estado del pedido actualizado');
      await loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el estado');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pendiente':
        return 'warning';
      case 'en preparación':
        return 'info';
      case 'entregado':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#386273]">Gestión de Pedidos</h1>

          <div className="flex items-center gap-4">
            <label className="text-[#386273] font-medium">Filtrar por estado:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-48 px-4 py-2 border border-[#B6E1F2] rounded-lg focus:outline-none focus:border-[#386273]"
            >
              <option value="all">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en preparación">En preparación</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
        </div>

        <div className="bg-white border-2 border-[#B6E1F2] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#386273] text-white">
                <tr>
                  <th className="text-left py-4 px-4">ID Pedido</th>
                  <th className="text-left py-4 px-4">Cliente</th>
                  <th className="text-left py-4 px-4">Fecha</th>
                  <th className="text-left py-4 px-4">Total</th>
                  <th className="text-left py-4 px-4">Estado</th>
                  <th className="text-left py-4 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono">{order.id}</td>
                    <td className="py-3 px-4 text-sm">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      S/ {order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Order['status'])
                        }
                        className="px-3 py-1 border border-[#B6E1F2] rounded text-sm focus:outline-none"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en preparación">En preparación</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay pedidos para mostrar
              </div>
            )}
          </div>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Detalles del Pedido {selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="border-b-2 border-[#B6E1F2] pb-4">
                  <h3 className="text-lg font-bold text-[#386273] mb-3">
                    Información del Cliente
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <Badge variant={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="text-lg font-bold text-[#386273] mb-3">Productos</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-[#386273]">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity} × S/ {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-[#386273]">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-[#B6E1F2] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-[#386273]">
                      S/ {selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
