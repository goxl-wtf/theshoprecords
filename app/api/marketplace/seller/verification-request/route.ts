import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/utils/supabase';

interface VerificationRequestData {
  seller_id: string;
  business_name: string;
  website_url?: string;
  tax_id: string;
  additional_info?: string;
}

export async function POST(request: NextRequest) {
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
    
    // Parse request body
    const requestData: VerificationRequestData = await request.json();
    
    // Validate required fields
    if (!requestData.seller_id || !requestData.business_name || !requestData.tax_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify that the seller_id belongs to the current user
    const { data: sellerProfile, error: sellerError } = await supabase
      .from('seller_profiles')
      .select('id, user_id')
      .eq('id', requestData.seller_id)
      .single();
    
    if (sellerError || !sellerProfile) {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      );
    }
    
    if (sellerProfile.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only submit verification requests for your own seller profile' },
        { status: 403 }
      );
    }
    
    // Check if a verification request already exists
    const { data: existingRequest, error: existingRequestError } = await supabase
      .from('seller_verification_requests')
      .select('id, status')
      .eq('seller_id', requestData.seller_id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!existingRequestError && existingRequest && existingRequest.length > 0) {
      const latestRequest = existingRequest[0];
      
      if (latestRequest.status === 'pending') {
        return NextResponse.json(
          { error: 'You already have a pending verification request' },
          { status: 400 }
        );
      }
    }
    
    // Create the verification request
    const { data: verificationRequest, error: insertError } = await supabase
      .from('seller_verification_requests')
      .insert({
        seller_id: requestData.seller_id,
        business_name: requestData.business_name,
        website_url: requestData.website_url || null,
        tax_id: requestData.tax_id,
        additional_info: requestData.additional_info || null,
        status: 'pending',
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating verification request:', insertError);
      return NextResponse.json(
        { error: 'Failed to create verification request' },
        { status: 500 }
      );
    }
    
    // Send admin notification (this would be implemented separately)
    // In a production environment, you might send an email or create a task
    // in an admin dashboard to review the verification request
    
    return NextResponse.json({
      success: true,
      message: 'Verification request submitted successfully',
      request_id: verificationRequest.id
    });
    
  } catch (error) {
    console.error('Error processing verification request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 