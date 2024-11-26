import React from 'react';
import { AlertTriangle, MessageCircle } from 'lucide-react';

const SuspendedAccountPage = () => {
  return (
    <div className="min-h-screen bg-red-600 flex justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle color="#DC2626" size={80} className="animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Account Suspended
        </h1>
        
        <p className="text-gray-700 mb-6">
          Your account transfers have been temporarily disabled due to a security review or policy violation.
        </p>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start space-x-3">
            <MessageCircle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <p className="text-red-800 font-semibold">
                Need to Resolve This?
              </p>
              <p className="text-red-600 text-sm">
                Please reach out to our support team 
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-gray-500 text-sm italic">
          Reference Number: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccountPage;