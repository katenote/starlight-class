import React, { useState } from 'react';
import { TEACHER_ACCOUNT } from '../utils/defaultData';
import { LogIn, ShieldCheck, UserCheck, KeyRound, User } from 'lucide-react';

export default function LoginView({ students, onLoginSuccess, addToast }) {
  const [tab, setTab] = useState('student'); // 'student' | 'teacher'
  const [username, setUsername] = useState('star1');
  const [password, setPassword] = useState('1234');

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();

    if (tab === 'teacher') {
      if (cleanUser === TEACHER_ACCOUNT.username && password === TEACHER_ACCOUNT.password) {
        addToast('선생님으로 로그인되었습니다! 반갑습니다. 👋', 'success');
        onLoginSuccess({ role: 'teacher', studentId: null });
      } else {
        addToast('교사 아이디(teacher) 또는 비밀번호(1234)가 일치하지 않습니다.', 'warning');
      }
    } else {
      // Student login
      const matchedStudent = students.find(
        (s) => s.username.toLowerCase() === cleanUser
      );

      if (matchedStudent) {
        if (password === matchedStudent.password || password === '1234') {
          addToast(`${matchedStudent.name} (아이디: ${matchedStudent.username})으로 로그인되었습니다! 🪙`, 'success');
          onLoginSuccess({ role: 'student', studentId: matchedStudent.id });
        } else {
          addToast('비밀번호가 일치하지 않습니다. (기본 비밀번호: 1234)', 'warning');
        }
      } else {
        addToast(`존재하지 않는 학생 아이디입니다. (예: star1 ~ star25)`, 'warning');
      }
    }
  };

  const handleQuickStudentSelect = (num) => {
    setUsername(`star${num}`);
    setPassword('1234');
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
          boxShadow: 'var(--shadow-lg)',
          borderColor: 'rgba(99, 102, 241, 0.3)'
        }}
      >
        {/* Header Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 0.75rem auto',
              boxShadow: 'var(--glow-primary)'
            }}
          >
            🪙
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            별빛교실 로그인
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            학급 화폐 및 게이미피케이션 관리 시스템
          </p>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            className={`btn ${tab === 'student' ? 'btn-success' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
            onClick={() => {
              setTab('student');
              setUsername('star1');
              setPassword('1234');
            }}
          >
            <UserCheck className="w-4 h-4" />
            <span>학생 로그인</span>
          </button>
          <button
            type="button"
            className={`btn ${tab === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
            onClick={() => {
              setTab('teacher');
              setUsername('teacher');
              setPassword('1234');
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>교사 로그인</span>
          </button>
        </div>

        {/* Account Info Hint Banner */}
        <div
          style={{
            background: tab === 'teacher' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${tab === 'teacher' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            color: '#e2e8f0',
            marginBottom: '1.25rem'
          }}
        >
          {tab === 'teacher' ? (
            <div>
              <strong>👩‍🏫 교사 로그인 정보:</strong>
              <div style={{ marginTop: '0.2rem', color: '#a5b4fc' }}>
                아이디: <code>teacher</code> | 비밀번호: <code>1234</code>
              </div>
            </div>
          ) : (
            <div>
              <strong>🧑‍🎓 학생 로그인 정보 (1번~25번):</strong>
              <div style={{ marginTop: '0.2rem', color: '#6ee7b7' }}>
                아이디: <code>star1</code> ~ <code>star25</code> | 비밀번호: <code>1234</code>
              </div>
            </div>
          )}
        </div>

        {/* Quick Student Number Selectors */}
        {tab === 'student' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              빠른 번호 선택 (클릭 시 자동 입력):
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.35rem',
                maxHeight: 100,
                overflowY: 'auto',
                padding: '0.4rem',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleQuickStudentSelect(num)}
                  style={{
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.75rem',
                    borderRadius: 6,
                    border: username === `star${num}` ? '1px solid #10b981' : '1px solid var(--border-color)',
                    background: username === `star${num}` ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.8)',
                    color: username === `star${num}` ? '#6ee7b7' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {num}번
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">아이디 (ID)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder={tab === 'teacher' ? 'teacher' : 'star1'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 (PW)</label>
            <input
              type="password"
              className="form-input"
              placeholder="1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn ${tab === 'teacher' ? 'btn-primary' : 'btn-success'}`}
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
          >
            <LogIn className="w-4 h-4" />
            <span>{tab === 'teacher' ? '교사 모드로 접속하기' : '학생 모드로 접속하기'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
