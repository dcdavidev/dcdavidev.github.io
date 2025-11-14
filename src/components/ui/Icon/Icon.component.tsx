'use client';

import * as React from 'react';

import * as TablerIcons from '@tabler/icons-react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  stroke?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function IconComponent({
  name,
  size = 24,
  color,
  stroke = 2,
  className,
  style,
}: IconProps): React.ReactElement | null {
  // During SSR, render a placeholder span to avoid hydration issues
  if (typeof window === 'undefined') {
    return (
      <span
        style={{ display: 'inline-block', width: size, height: size, ...style }}
        className={className}
      />
    );
  }

  const iconName = name.startsWith('Icon') ? name : `Icon${name}`;

  const IconElement = (
    TablerIcons as unknown as Record<
      string,
      React.ComponentType<{
        size?: number;
        color?: string;
        stroke?: number;
        className?: string;
        style?: React.CSSProperties;
      }>
    >
  )[iconName];

  if (!IconElement) {
    console.warn(`Icon "${iconName}" not found in @tabler/icons-react`);
    return null;
  }

  return (
    <IconElement
      size={size}
      color={color}
      stroke={stroke}
      className={className}
      style={style}
    />
  );
}
