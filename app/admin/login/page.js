'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { CompanyLogo } from '@/components/ui/LoadingSpinner';
import { FooterInfo } from '@/components/auth/FooterInfo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimation } from '@/hooks/useAnimation';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function LoginPage() {
  // =============
  // Custom hooks
  // =============
  const { login } = useAuth();
  const [shakeForm, triggerShake] = useAnimation('shake', 500);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // =============
  // State
  // =============
  const [isLoading, setIsLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(null);
  
  // =============
  // Effects
  // =============
  useEffect(() => {
    setCurrentDateTime(AUTH_CONSTANTS.CURRENT_YEAR);
  }, []);
  
  // Updated role-based redirect logic
  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role;
      if (['superadmin', 'admin'].includes(role)) {
        router.replace('/admin/employees-management');
      } else if (['security', 'hr'].includes(role)) {
        router.replace('/admin/attendance-logs');
      } else {
        router.replace('/admin');
      }
    }
  }, [session, router]);
  
  // =============
  // Event handlers
  // =============
  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await login(data);

      if (!result.success) {
        triggerShake();
        setIsLoading(false);
        return { error: AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS };
      }

      // No redirect here! useEffect will handle it
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      triggerShake();
      return { error: AUTH_CONSTANTS.ERROR_MESSAGES.GENERAL_ERROR };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" data-testid="login-page">
      <div className={`w-full max-w-md ${shakeForm ? 'animate-shake' : ''}`}>
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CompanyLogo />
            <CardTitle className="text-2xl font-bold">{AUTH_CONSTANTS.LABELS.TITLE}</CardTitle>
            <CardDescription>{AUTH_CONSTANTS.LABELS.SUBTITLE}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <FooterInfo 
              year={currentDateTime} 
              company={AUTH_CONSTANTS.COMPANY_NAME} 
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}