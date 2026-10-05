import React from 'react';
import { ShieldCheck, UserCheck, LogOut } from 'lucide-react';

export default function Header({
  currentUser,
  onLogout
}) {
  return (
    <header className="app-header">
      {/* Brand Logo */}
      <div className="brand-logo">
        <div className="brand-icon">
          🪙
        </div>
        <div>
          <div className="brand-title">
            <span>별빛교실</span>
            <span className="brand-badge">학급 경제 & EXP</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            함께 성장하고 꿈을 이루는 학급 공동체
          </p>
        </div>
      </div>

      {/* Current User Session & Logout */}
      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(30, 41, 59, 0.9)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem'
            }}
          >
            {currentUser.role === 'teacher' ? (
              <>
                <ShieldCheck style={{ width: 16, height: 16, color: '#818cf8' }} />
                <span style={{ fontWeight: 700, color: '#a5b4fc' }}>👩‍🏫 담임선생님 접속 중</span>
              </>
            ) : (
              <>
                <UserCheck style={{ width: 16, height: 16, color: '#34d399' }} />
                <span style={{ fontWeight: 700, color: '#6ee7b7' }}>
                  🧑‍🎓 {currentUser.studentName} ({currentUser.username}) 접속 중
                </span>
              </>
            )}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </header>
  );
}
