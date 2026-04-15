import React from 'react';
import { cn } from '../../utils/cn';
import { H1, TextSmall } from './Typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6", className)}>
      <div>
        <H1 className="text-2xl font-bold text-slate-900">{title}</H1>
        {description && (
          <TextSmall className="mt-1 text-sm text-slate-600">{description}</TextSmall>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-4">{actions}</div>
      )}
    </div>
  );
}
