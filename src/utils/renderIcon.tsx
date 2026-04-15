import React from 'react';
import type { LucideIcon } from 'lucide-react';

export function renderIcon(icon: LucideIcon | React.ReactNode, className: string) {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon && 'render' in (icon as Record<string, unknown>))) {
    const IconComponent = icon as LucideIcon;
    return <IconComponent className={className} />;
  }
  return icon;
}
