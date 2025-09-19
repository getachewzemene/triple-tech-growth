'use client';

import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SecurityMetricsProps {
  formType: 'login' | 'signup' | 'admin' | 'course-creation';
  validationsPassed: number;
  totalValidations: number;
  hasSecureConnection?: boolean;
  rateLimitRemaining?: number;
  showDetails?: boolean;
}

export const SecurityMetrics: React.FC<SecurityMetricsProps> = ({
  formType,
  validationsPassed,
  totalValidations,
  hasSecureConnection = true,
  rateLimitRemaining = 5,
  showDetails = false
}) => {
  const securityScore = Math.round((validationsPassed / totalValidations) * 100);
  
  const getSecurityLevel = () => {
    if (securityScore >= 90) return { level: 'High', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (securityScore >= 70) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const { level, color, bgColor } = getSecurityLevel();

  const getFormTypeLabel = () => {
    switch (formType) {
      case 'login': return 'Login Form';
      case 'signup': return 'Registration Form';
      case 'admin': return 'Admin Panel';
      case 'course-creation': return 'Course Creation';
      default: return 'Form';
    }
  };

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <Shield className={`h-3 w-3 ${color}`} />
        <span className={color}>Security: {level}</span>
        <Badge variant="outline" className={`${bgColor} ${color} border-current`}>
          {securityScore}%
        </Badge>
      </div>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            {getFormTypeLabel()} Security
          </h4>
          <Badge variant="outline" className={`${bgColor} ${color} border-current`}>
            {level} ({securityScore}%)
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Validations Passed
            </span>
            <span className="font-medium">{validationsPassed}/{totalValidations}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className={`h-3 w-3 ${hasSecureConnection ? 'text-green-500' : 'text-red-500'}`} />
              Secure Connection
            </span>
            <span className={hasSecureConnection ? 'text-green-600' : 'text-red-600'}>
              {hasSecureConnection ? 'HTTPS' : 'HTTP'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className={`h-3 w-3 ${rateLimitRemaining > 2 ? 'text-green-500' : 'text-orange-500'}`} />
              Rate Limit
            </span>
            <span className={rateLimitRemaining > 2 ? 'text-green-600' : 'text-orange-600'}>
              {rateLimitRemaining} attempts left
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-blue-500" />
              Form Protection
            </span>
            <span className="text-blue-600">Active</span>
          </div>
        </div>
        
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              securityScore >= 90 ? 'bg-green-500' : 
              securityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${securityScore}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMetrics;