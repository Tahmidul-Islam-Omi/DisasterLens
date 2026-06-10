import type { Role } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

/**
 * RoleBadge Component
 * 
 * Displays a color-coded badge for user roles
 * 
 * Features:
 * - Color-coded by role (Admin: Red, LocalAuthority: Purple, Volunteer: Green)
 * - Bilingual support (English/Bengali)
 * - Multiple sizes (sm, md, lg)
 * - Optional icon display
 */
export function RoleBadge({ role, size = 'md', showIcon = false }: RoleBadgeProps) {
  const { t } = useLanguage();

  // Get role-specific styling
  const getRoleStyles = () => {
    switch (role) {
      case 'Admin':
        return {
          bg: '#DC2626',
          text: 'white',
          label: t('role_admin'),
          icon: '👑',
        };
      case 'LocalAuthority':
        return {
          bg: '#7C3AED',
          text: 'white',
          label: t('role_local_authority'),
          icon: '🏛️',
        };
      case 'Volunteer':
        return {
          bg: '#16A34A',
          text: 'white',
          label: t('role_volunteer'),
          icon: '🤝',
        };
      default:
        return {
          bg: '#6B7280',
          text: 'white',
          label: role,
          icon: '👤',
        };
    }
  };

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-base px-4 py-1.5';
      case 'md':
      default:
        return 'text-sm px-3 py-1';
    }
  };

  const styles = getRoleStyles();
  const sizeClasses = getSizeClasses();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {showIcon && <span>{styles.icon}</span>}
      <span>{styles.label}</span>
    </span>
  );
}
