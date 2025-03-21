'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

export default function AuthDebugPage() {
  const { user, isLoading } = useUser();
  const [authResponse, setAuthResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function checkAuthStatus() {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/debug');
      const data = await response.json();
      setAuthResponse(data);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Auth Debug Page</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current User State</h2>
        
        {isLoading ? (
          <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
        ) : (
          <div>
            <p className="mb-2">
              <span className="font-bold">User Logged In:</span> {user ? 'Yes' : 'No'}
            </p>
            {user && (
              <div className="mt-3">
                <p className="mb-1"><span className="font-bold">User ID:</span> {user.id}</p>
                <p className="mb-1"><span className="font-bold">Email:</span> {user.email}</p>
                <p className="mb-1">
                  <span className="font-bold">Demo User:</span> {user.isDemoUser ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <button 
          onClick={checkAuthStatus} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Auth Status'}
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Auth Debug Response</h2>
          
          {loading ? (
            <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {authResponse ? JSON.stringify(authResponse, null, 2) : 'No data'}
            </pre>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Test Login Form</h2>
        <iframe 
          src="/test-login-form.html" 
          className="w-full h-[600px] border-0"
          title="Login Test Form"
        />
      </div>
    </div>
  );
} 