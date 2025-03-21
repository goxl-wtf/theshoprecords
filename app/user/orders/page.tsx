'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import UserDashboardNav from '@/components/ui/UserDashboardNav';

// Format currency function since we can't access the utils/formatters
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    slug: string;
    images: { url: string }[];
  };
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  payment_status: string;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    name: string;
  };
  shipping_method: string;
  contact_email: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in and done loading, redirect to login
    if (!userLoading && !user) {
      router.push('/auth/login?redirect=/user/orders');
      return;
    }

    // Only fetch orders if user is logged in
    if (user) {
      fetchOrders();
    }
  }, [user, userLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders...');
      
      const response = await fetch('/api/user/orders');
      console.log('Orders API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Orders API error response:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log(`Received ${data.orders?.length || 0} orders from API`);
      setOrders(data.orders || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Account</h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Side Navigation */}
        <div className="md:col-span-1">
          <UserDashboardNav />
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Order History</h2>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-64 bg-gray-200 rounded w-full"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
              <p className="font-medium">Error loading orders</p>
              <p>{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200 text-center">
              <h3 className="text-xl font-bold mb-2">No orders yet</h3>
              <p className="mb-6">Looks like you haven&apos;t placed any orders yet.</p>
              <Link 
                href="/shop" 
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">Order #{order.id.slice(0, 8)}</h3>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Total</p>
                      <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative w-20 h-20 bg-gray-100 rounded">
                          {item.product.images && item.product.images[0] ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              fill
                              sizes="80px"
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-200 rounded">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <Link 
                            href={`/product/${item.product.slug}`}
                            className="text-lg font-medium hover:text-blue-600 transition"
                          >
                            {item.product.title}
                          </Link>
                          <div className="mt-1 flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <p className="text-gray-600">Qty: {item.quantity}</p>
                              <p className="text-gray-600">{formatCurrency(item.price)} each</p>
                            </div>
                            <p className="font-semibold mt-2 sm:mt-0">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Shipping Information</h3>
                    <p>{order.shipping_address.name}</p>
                    <p>{order.shipping_address.line1}</p>
                    {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state}{' '}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    <p className="mt-2 text-gray-600">Method: {order.shipping_method}</p>
                    <p className="text-gray-600">Contact: {order.contact_email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 