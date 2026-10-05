import React, { useState } from 'react';
import { Coins, Zap, X, Check } from 'lucide-react';

export default function TransactionModal({
  isOpen,
  onClose,
  targetStudentIds,
  students,
  onConfirm
}) {
  const [amount, setAmount] = useState(100);
  const [expAmount, setExpAmount] = useState(100);
  const [type, setType] = useState('add'); // 'add' | 'deduct'
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const targetNames = targetStudentIds
    .map((id) => {
      const s = students.find((st) => st.id === id);
      return s ? `${s.id}번 ${s.name}` : '';
    })
    .filter(Boolean)
    .join(', ');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('지급/차감 사유를 입력해 주세요!');
      return;
    }
    const finalAmount = type === 'add' ? Math.abs(amount) : -Math.abs(amount);
    const finalExp = type === 'add' ? Math.abs(expAmount) : 0; // EXP는 차감 시엔 감량 안 함 (누적 유지)
    
    onConfirm({
      studentIds: targetStudentIds,
      amount: finalAmount,
      expAmount: finalExp,
      reason: reason.trim()
    });
    setReason('');
    onClose();
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins style={{ color: '#f59e0b' }} />
            <span>화폐 및 EXP {type === 'add' ? '지급' : '차감'}</span>
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#a5b4fc', marginBottom: '1rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.6rem 0.85rem', borderRadius: 8 }}>
          <strong>대상 ({targetStudentIds.length}명):</strong> {targetNames}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Action Type Toggle */}
          <div className="form-group">
            <label className="form-label">구분 선택</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${type === 'add' ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => setType('add')}
              >
                + 보상 지급 (화폐 + EXP)
              </button>
              <button
                type="button"
                className={`btn ${type === 'deduct' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setType('deduct')}
              >
                - 화폐 차감 (벌금/소비)
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="form-group">
            <label className="form-label">빠른 금액 선택</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setAmount(amt);
                    if (type === 'add') setExpAmount(amt);
                  }}
                >
                  {amt}꿈돈
                </button>
              ))}
            </div>
          </div>

          {/* Amount Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-group">
            <div>
              <label className="form-label">화폐 {type === 'add' ? '지급액' : '차감액'} (꿈돈)</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="form-label">누적 경험치 (+EXP)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={type === 'add' ? expAmount : 0}
                onChange={(e) => setExpAmount(Number(e.target.value))}
                disabled={type === 'deduct'}
              />
            </div>
          </div>

          {/* Reason Input */}
          <div className="form-group">
            <label className="form-label">지급/차감 사유 (필수)</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 1인 1역 완벽 수행, 발표 우수, 수업 규칙 위반 등"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className={`btn ${type === 'add' ? 'btn-success' : 'btn-danger'}`}>
              <Check className="w-4 h-4" />
              <span>확인 ({type === 'add' ? '지급' : '차감'})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
