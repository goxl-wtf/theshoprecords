'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/utils/supabase';
import { formatCurrency } from '@/utils/formatters';
import { Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: any;
  items: any[];
  payment_intent: string;
}

const statusIcons = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  processing: <Package className="h-5 w-5 text-blue-500" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
  cancelled: <AlertCircle className="h-5 w-5 text-red-500" />,
};

const statusText = {
  pending: 'Payment Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  
  // Initialize user and supabase
  useEffect(() => {
    async function initUser() {
      const supabase = getSupabase();
      if (!supabase) return;
      
      try {
        setUserLoading(true);
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setUserLoading(false);
      }
    }
    
    initUser();
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    const supabase = getSupabase();
    if (!supabase) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoading && user) {
      fetchOrders();
    }
  }, [userLoading, user, fetchOrders]);

  if (loading || userLoading) {
    return (
      <div className="my-8 text-center">
        <div className="animate-pulse flex justify-center items-center space-x-2">
          <div className="h-3 w-3 bg-gray-300 rounded-full animate-bounce"></div>
          <div className="h-3 w-3 bg-gray-300 rounded-full animate-bounce delay-75"></div>
          <div className="h-3 w-3 bg-gray-300 rounded-full animate-bounce delay-150"></div>
        </div>
        <p className="mt-2 text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-8 text-center">
        <p>Please log in to view your orders.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-8 text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No orders yet</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          When you place an order, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Orders</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between border-b dark:border-gray-700">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Order #{order.id.substring(0, 8)}
                  </h3>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {statusIcons[order.status as keyof typeof statusIcons]}
                    <span className="ml-1.5 text-xs font-medium">
                      {statusText[order.status as keyof typeof statusText]}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <p className="font-medium text-right">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50">
              <h4 className="text-sm font-medium mb-3">Order Items</h4>
              <ul className="space-y-3">
                {order.items?.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <div>
                      <span className="text-gray-800 dark:text-gray-200">{item.title}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">×{item.quantity}</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 