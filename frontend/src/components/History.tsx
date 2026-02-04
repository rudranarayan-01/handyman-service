import React from 'react';
import { Calendar, Clock, ChevronRight, MapPin, ReceiptText } from 'lucide-react';
import { orderHistory, type OrderStatus } from '@/data/Oders';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    'Scheduled': 'bg-blue-50 text-blue-700 border-blue-100',
    'Completed': 'bg-green-50 text-green-700 border-green-100',
    'Cancelled': 'bg-red-50 text-red-700 border-red-100',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};

const OrderHistory = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 mt-10 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-[28px] font-black text-gray-900 tracking-tight">Booking History</span>
          <button className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
            <ReceiptText className="w-5 h-5 text-gray-200" />
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {orderHistory.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Service Image */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                  <img src={order.image} alt={order.serviceName} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{order.serviceName}</h3>
                      <p className="text-xs font-medium text-gray-400 mt-1">ID: {order.id}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-semibold text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {order.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {order.time}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-lg font-black text-gray-900">₹{order.price}</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {order.status === 'Completed' && (
                        <button className="text-xs font-black text-blue-600 hover:underline tracking-widest uppercase">
                            Rate Service
                        </button>
                    )}
                    <button className="flex items-center gap-1 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                        View Details <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Mockup */}
        {orderHistory.length === 0 && (
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