import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { getLevelInfo } from '../utils/defaultData';
import { 
  CheckCircle, 
  ShoppingBag, 
  Ticket, 
  History, 
  Sparkles, 
  Coins, 
  Award, 
  Clock, 
  Check, 
  Zap,
  Info
} from 'lucide-react';

export default function StudentDashboard({
  student,
  roles,
  missions,
  storeItems,
  purchases,
  logs,
  onCompleteTask,
  onBuyItem,
  onUseCoupon,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'store' | 'coupons' | 'logs'

  if (!student) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>학생을 선택해 주세요.</h2>
      </div>
    );
  }

  const levelInfo = getLevelInfo(student.exp);
  const myRole = roles.find((r) => r.id === student.roleId);
  const myPurchases = purchases.filter((p) => p.studentId === student.id);
  const myLogs = logs.filter((l) => l.studentId === student.id);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // fallback
    }
  };

  const handleTaskComplete = (taskId, taskTitle, rewardBalance, rewardExp) => {
    triggerConfetti();
    onCompleteTask(student.id, taskId, taskTitle, rewardBalance, rewardExp);
  };

  return (
    <div>
      {/* 🌟 1. Top Student Status Banner (My Status) */}
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(49, 46, 129, 0.7))',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          marginBottom: '1.5rem',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          {/* Left Student Bio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div 
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: 'var(--glow-primary)'
              }}
            >
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{student.id}번 {student.name}</h2>
                <span className="exp-badge">{levelInfo.title}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#a5b4fc', marginTop: '0.2rem' }}>
                내 1인 1역: <strong style={{ color: '#fff' }}>{myRole ? myRole.name : '미배정'}</strong>
              </p>
            </div>
          </div>

          {/* Right Stat Cards */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Balance Card */}
            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                minWidth: 140
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>내 화폐 잔액</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>🪙</span>
                <span>{student.balance.toLocaleString()}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>꿈돈</span>
              </div>
            </div>

            {/* Level & EXP Card */}
            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                minWidth: 180
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Lv.{levelInfo.level} 누적 경험치</span>
                <span style={{ color: '#c084fc' }}>{student.exp} EXP</span>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: '0.4rem' }}>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${levelInfo.progressPercent}%` }}></div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', textAlign: 'right' }}>
                  다음 레벨까지 {Math.max(0, levelInfo.nextExp - student.exp)} EXP 남음
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle className="w-4 h-4" />
          <span>오늘 할 일 ({student.completedTasks ? student.completedTasks.length : 0})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>학급 상점</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          <Ticket className="w-4 h-4" />
          <span>내 보유 쿠폰 ({myPurchases.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <History className="w-4 h-4" />
          <span>화폐/EXP 내역</span>
        </button>
      </div>

      {/* 📌 Tab 1: 오늘 할 일 (Tasks) */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section 1: 1인 1역 미션 */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc' }}>
              <Award className="w-5 h-5 text-indigo-400" />
              <span>내 1인 1역 일일 미션</span>
            </h3>

            {myRole ? (
              <div 
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{myRole.name}</span>
                    <span className="currency-badge">+ {myRole.dailyReward}꿈돈 & EXP</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{myRole.description}</p>
                </div>

                {student.completedTasks?.includes(`role_${myRole.id}`) ? (
                  <button className="btn btn-secondary" disabled style={{ opacity: 0.7 }}>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>오늘 완료됨</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => handleTaskComplete(`role_${myRole.id}`, `1인 1역 [${myRole.name}] 완료`, myRole.dailyReward, myRole.dailyReward)}
                  >
                    <Zap className="w-4 h-4" />
                    <span>오늘 역 할 일 완료하기</span>
                  </button>
                )}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>아직 배정된 1인 1역이 없습니다. 선생님께 문의해 주세요.</p>
            )}
          </div>

          {/* Section 2: 학급 일일 공통 미션 */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>오늘의 학급 공통 미션</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {missions.map((m) => {
                const isDone = student.completedTasks?.includes(m.id);
                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isDone ? '#94a3b8' : '#fff' }}>
                        {m.title}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                        <span className="currency-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>
                          +{m.rewardBalance}꿈돈
                        </span>
                        <span className="exp-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>
                          +{m.rewardExp} EXP
                        </span>
                      </div>
                    </div>

                    {isDone ? (
                      <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.7 }}>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>완료됨</span>
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTaskComplete(m.id, m.title, m.rewardBalance, m.rewardExp)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>실천 완료</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 🛍️ Tab 2: 학급 상점 (Classroom Store) */}
      {activeTab === 'store' && (
        <div className="grid-responsive">
          {storeItems.map((item) => {
            const canAfford = student.balance >= item.price;
            const inStock = item.stock > 0;

            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h4>
                    <span 
                      style={{
                        fontSize: '0.75rem',
                        background: item.category === 'coupon' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                        color: item.category === 'coupon' ? '#a5b4fc' : '#f472b6',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 6,
                        fontWeight: 600
                      }}
                    >
                      {item.category === 'coupon' ? '쿠폰' : '물품'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>{item.description}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                      🪙 {item.price} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>꿈돈</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: inStock ? '#10b981' : '#ef4444' }}>
                      {inStock ? `재고 ${item.stock}개` : '품절'}
                    </div>
                  </div>

                  <button
                    className={`btn ${canAfford && inStock ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%' }}
                    disabled={!canAfford || !inStock}
                    onClick={() => {
                      if (canAfford && inStock) {
                        onBuyItem(student.id, item);
                        triggerConfetti();
                      }
                    }}
                  >
                    {!inStock ? '품절되었습니다' : !canAfford ? '잔액이 부족합니다' : '구매하기'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🎟️ Tab 3: 내 보유 쿠폰함 (My Coupons) */}
      {activeTab === 'coupons' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket className="w-5 h-5 text-indigo-400" />
            <span>내가 보관 중인 쿠폰 & 물품 ({myPurchases.length})</span>
          </h3>

          {myPurchases.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <p>보유 중인 쿠폰이 없습니다. 학급 상점에서 쿠폰을 구매해 보세요!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myPurchases.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{p.itemTitle}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      구매일: {p.purchasedAt} | 가격: 🪙 {p.price}꿈돈
                    </div>
                  </div>

                  <div>
                    {p.status === 'active' && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => onUseCoupon(p.id)}
                      >
                        <Clock className="w-4 h-4" />
                        <span>선생님께 사용 요청하기</span>
                      </button>
                    )}
                    {p.status === 'used_pending' && (
                      <span className="btn btn-secondary btn-sm" style={{ opacity: 0.8, color: '#f59e0b' }}>
                        ⏳ 선생님 사용 승인 대기 중
                      </span>
                    )}
                    {p.status === 'used_approved' && (
                      <span className="btn btn-secondary btn-sm" style={{ opacity: 0.6 }}>
                        ✅ 사용 완료됨
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 📜 Tab 4: 화폐/EXP 내역 (Logs) */}
      {activeTab === 'logs' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            화폐 및 경험치 입출금 기록
          </h3>

          {myLogs.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>아직 거래 내역이 없습니다.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {myLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: log.amount > 0 ? '4px solid #10b981' : '4px solid #ef4444'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.reason}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.timestamp}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: log.amount > 0 ? '#10b981' : '#ef4444' }}>
                      {log.amount > 0 ? `+${log.amount}` : log.amount} 꿈돈
                    </div>
                    {log.expAmount > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#c084fc' }}>
                        +{log.expAmount} EXP
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
