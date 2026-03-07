import { useEffect, useState, useCallback } from 'react';
import { Calendar, Clock, ChevronRight, Inbox } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner'; // Switched to sonner for consistency with your other files
import api from '@/api/api';
import { useNavigate } from 'react-router-dom';
import BookingSkeleton from './Skeletons/BookingSkeleton';

// Utility for dynamic status colors
const getStatusStyles = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (s === 'cancelled' || s === 'failed') return 'bg-red-50 text-red-700 border-red-100';
  return 'bg-amber-50 text-amber-700 border-amber-100'; // Pending/Processing
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    if (!isLoaded) return;
    try {
      const token = await getToken();
      const response = await api.get('/orders/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure we always have an array
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Could not load booking history");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isLoaded]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Booking History
            </h1>
            <p className="text-sm text-slate-500 font-medium">Track and manage your past service requests</p>
          </div>
          {orders.length > 0 && (
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
              {orders.length} TOTAL BOOKINGS
            </div>
          )}
        </div>

        {/* List Content */}
        {isLoading ? (
          <BookingSkeleton />
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/order-history/${order._id}`)}
                className="bg-white rounded-[2rem] border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Service Icon */}
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl shrink-0 bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    {order.items?.[0]?.image ? (
                        <img src={order.items[0].image} className="w-full h-full object-cover rounded-2xl" alt="service" />
                    ) : (
                        <span className="text-xl md:text-2xl font-black text-blue-500">
                            {order.items?.[0]?.name?.[0] || 'S'}
                        </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg md:text-xl leading-tight group-hover:text-blue-600 transition-colors">
                          {order.items?.map((i: any) => i.name).join(", ") || "Service Details"}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                          ID: #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${getStatusStyles(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs md:text-sm font-bold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Paid</span>
                    <span className="text-xl font-black text-slate-900">₹{order.totalAmount}</span>
                  </div>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg transition-all active:scale-95 group/btn">
                    Details 
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - Hosting Ready UX */
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Inbox className="text-slate-300 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No bookings found</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium">
              You haven't booked any services yet. Start exploring our categories!
            </p>
            <button 
              onClick={() => navigate('/categories')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;