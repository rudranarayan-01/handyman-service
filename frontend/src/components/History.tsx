import { useEffect, useState } from 'react';
import { Calendar, Clock, ChevronRight, MapPin,  Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react'; // or your auth provider
import toast from 'react-hot-toast';
import api from '@/api/api';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/orders/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load booking history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 mt-15 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-[28px] font-black text-gray-900 tracking-tight">Booking History</span>
          
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Service Icon/Image Placeholder */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-500">{order.items[0]?.name[0]}</span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {order.items.map((i: any) => i.name).join(", ")}
                      </h3>
                      <p className="text-xs font-medium text-gray-400 mt-1 uppercase">ID: ...{order._id.slice(-6)}</p>
                    </div>
                    {/* Map your backend 'pending' status to your UI status badges */}
                    <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-100">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-semibold text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(order.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(order.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-lg font-black text-gray-900">₹{order.totalAmount}</p>
                </div>
                <button
                  onClick={() => navigate(`/order-history/${order._id}`)} // order._id aapka MongoDB ID hai
                  className="flex items-center gap-1 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400 w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">No bookings yet</h2>
            <p className="text-gray-500 mt-2">Book your first service now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;