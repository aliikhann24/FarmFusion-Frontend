import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/dashboard',           icon: '🏠', label: 'Dashboard'    },
  { to: '/my-animals',          icon: '🐄', label: 'Animals'      },
  { to: '/cattle',              icon: '🏪', label: 'Market'       },
  { to: '/breeding-records',    icon: '🧬', label: 'Breeding'     },
  { to: '/feeding-records',     icon: '🌾', label: 'Feeding'      },
  { to: '/vaccination-records', icon: '💉', label: 'Vaccines'     },
  { to: '/animal-progress',     icon: '📈', label: 'Progress'     },
  { to: '/installments',        icon: '💳', label: 'Installments' },
  { to: '/vouchers',            icon: '🧾', label: 'Vouchers'     },
  { to: '/profile',             icon: '👤', label: 'Profile'      },
];

export default function QuickNav() {
  const { pathname } = useLocation();

  return (
    <div style={{
      background: 'white',
      borderRadius: '14px',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      padding: '14px 16px',
      marginBottom: '24px',
      overflowX: 'auto',
    }}>
      <div style={{
        display: 'flex',
        gap: '6px',
        minWidth: 'max-content',
      }}>
        {navLinks.map(link => {
          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: isActive ? 'var(--primary)' : '#f8faf8',
                border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                minWidth: '64px',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#f0faf4'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#f8faf8'; e.currentTarget.style.borderColor = 'var(--border)'; }}}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{link.icon}</span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isActive ? 'white' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}