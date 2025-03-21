import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/utils/supabase';

// Format for request period filter
export interface DateFilter {
  startDate: string;
  endDate: string;
}

// Basic sales analytics structure
export interface SalesAnalytics {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  recentOrders: any[];
  salesByDay: {
    date: string;
    amount: number;
    orders: number;
  }[];
  topProducts: {
    id: string;
    title: string;
    totalSold: number;
    revenue: number;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    // Get the supabase client
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // First, check if user is a seller
    const { data: sellerProfile, error: sellerError } = await supabase
      .from('seller_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (sellerError || !sellerProfile) {
      return NextResponse.json(
        { error: 'You are not registered as a seller' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month'; // default to month
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    let endDate = now;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'custom':
        if (customStart && customEnd) {
          startDate = new Date(customStart);
          endDate = new Date(customEnd);
        }
        break;
    }
    
    // Format dates for Supabase query
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Get seller orders within the date range
    const { data: orders, error: ordersError } = await supabase
      .from('seller_orders')
      .select('*')
      .eq('seller_id', sellerProfile.id)
      .gte('created_at', `${startDateStr}T00:00:00`)
      .lte('created_at', `${endDateStr}T23:59:59`)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.error('Error fetching seller orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch sales data' },
        { status: 500 }
      );
    }
    
    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
    
    // Get recent orders (just the most recent 5)
    const recentOrders = orders.slice(0, 5);
    
    // Prepare sales by day data
    const salesByDayMap = new Map();
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      
      if (!salesByDayMap.has(date)) {
        salesByDayMap.set(date, { date, amount: 0, orders: 0 });
      }
      
      const dailyData = salesByDayMap.get(date);
      dailyData.amount += (order.amount || 0);
      dailyData.orders += 1;
      salesByDayMap.set(date, dailyData);
    });
    
    // Convert the map to an array and sort by date
    const salesByDay = Array.from(salesByDayMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate top products
    // First, get all order items
    const productMap = new Map();
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.id;
          
          if (!productMap.has(productId)) {
            productMap.set(productId, {
              id: productId,
              title: item.title,
              totalSold: 0,
              revenue: 0
            });
          }
          
          const productData = productMap.get(productId);
          productData.totalSold += (item.quantity || 1);
          productData.revenue += (item.price * (item.quantity || 1));
          productMap.set(productId, productData);
        });
      }
    });
    
    // Convert to array and sort by revenue
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Just get top 5
    
    // Compile the analytics data
    const salesAnalytics: SalesAnalytics = {
      totalSales,
      orderCount,
      averageOrderValue,
      recentOrders,
      salesByDay,
      topProducts
    };
    
    return NextResponse.json({ data: salesAnalytics });
    
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 