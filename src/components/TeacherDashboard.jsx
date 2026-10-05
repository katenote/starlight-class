import React, { useState } from 'react';
import { getLevelInfo } from '../utils/defaultData';
import { 
  Users, 
  Coins, 
  Award, 
  ShoppingBag, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function TeacherDashboard({
  students,
  roles,
  missions,
  storeItems,
  purchases,
  logs,
  onOpenTransactionModal,
  onUpdateRoleAssignment,
  onAddRole,
  onAddMission,
  onAddStoreItem,
  onApproveCoupon,
  onRejectCoupon,
  onResetData,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'roles' | 'approvals' | 'missions' | 'settings'
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  
  // Modal Form States
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleReward, setNewRoleReward] = useState(50);
  
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionReward, setNewMissionReward] = useState(50);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(500);
  const [newItemCategory, setNewItemCategory] = useState('coupon');
  const [newItemStock, setNewItemStock] = useState(10);
  const [newItemDesc, setNewItemDesc] = useState('');

  // Dashboard Metrics
  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const avgLevel = (students.reduce((sum, s) => sum + getLevelInfo(s.exp).level, 0) / (students.length || 1)).toFixed(1);
  const pendingApprovals = purchases.filter((p) => p.status === 'used_pending');

  // Checkbox helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(students.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  return (
    <div>
      {/* 📊 1. Top Teacher Summary Stats */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>총 학생 수</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a5b4fc', marginTop: '0.2rem' }}>
            👥 {students.length}명
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>학급 총 유통 화폐</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
            🪙 {totalBalance.toLocaleString()}꿈돈
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>학급 평균 레벨</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
            ⭐ Lv.{avgLevel}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', borderColor: pendingApprovals.length > 0 ? 'rgba(245, 158, 11, 0.5)' : undefined }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>쿠폰 사용 승인 대기</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pendingApprovals.length > 0 ? '#f59e0b' : '#10b981', marginTop: '0.2rem' }}>
            ⏳ {pendingApprovals.length}건
          </div>
        </div>
      </div>

      {/* 🧭 Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          <Users className="w-4 h-4" />
          <span>학생 명렬표 & 화폐 관리 ({students.length}명)</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <Award className="w-4 h-4" />
          <span>1인 1역 배정 관리</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>상점 & 승인함 ({pendingApprovals.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          <Sparkles className="w-4 h-4" />
          <span>일일 미션 관리</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <RefreshCw className="w-4 h-4" />
          <span>데이터 초기화</span>
        </button>
      </div>

      {/* 👥 Tab 1: 학생 명렬표 & 화폐 관리 (Roster & Currency Control) */}
      {activeTab === 'roster' && (
        <div className="glass-card">
          {/* Action Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>전체 학생 목록 (25명)</h3>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                disabled={selectedStudentIds.length === 0}
                onClick={() => onOpenTransactionModal(selectedStudentIds)}
              >
                <Coins className="w-4 h-4" />
                <span>선택한 {selectedStudentIds.length}명에게 화폐/EXP 지급·차감</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.length === students.length && students.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>번호 & 이름</th>
                  <th>1인 1역</th>
                  <th>보유 화폐 (잔액)</th>
                  <th>레벨 & 경험치</th>
                  <th style={{ textAlign: 'right' }}>지급/차감</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const role = roles.find((r) => r.id === s.roleId);
                  const levelInfo = getLevelInfo(s.exp);
                  const isChecked = selectedStudentIds.includes(s.id);

                  return (
                    <tr key={s.id} style={{ background: isChecked ? 'rgba(99, 102, 241, 0.08)' : undefined }}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(s.id)}
                        />
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {s.id}번 {s.name}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: role ? '#a5b4fc' : '#94a3b8' }}>
                          {role ? role.name : '미배정'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: '#fbbf24' }}>
                          🪙 {s.balance.toLocaleString()}꿈돈
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: '#c084fc' }}>{levelInfo.title}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({s.exp} EXP)</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenTransactionModal([s.id])}
                        >
                          <span>지급·차감</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🛠️ Tab 2: 1인 1역 관리 (Roles) */}
      {activeTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 2-1: 학생별 역할 1인 1역 배정 */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              학생별 1인 1역 맞춤 배정
            </h3>

            <div className="grid-responsive">
              {students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {s.id}번 {s.name}
                  </div>
                  <select
                    className="form-select"
                    value={s.roleId || ''}
                    onChange={(e) => onUpdateRoleAssignment(s.id, e.target.value)}
                  >
                    <option value="">-- 역할 선택 안 함 --</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (+{r.dailyReward}꿈돈)
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2-2: 역할 목록 및 새 역할 추가 */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              학급 1인 1역 종목 정의 ({roles.length}개)
            </h3>

            {/* Add Role Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newRoleName.trim()) return;
                onAddRole({
                  name: newRoleName.trim(),
                  description: newRoleDesc.trim(),
                  dailyReward: Number(newRoleReward)
                });
                setNewRoleName('');
                setNewRoleDesc('');
                setNewRoleReward(50);
              }}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label className="form-label">새 역할 이름</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 급식도우미, 칠판 관리자"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">역할 업무 설명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 매 수업 후 칠판 깨끗이 지우기"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">일일 수행 보상 (꿈돈/EXP)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={newRoleReward}
                  onChange={(e) => setNewRoleReward(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success">
                <Plus className="w-4 h-4" />
                <span>역할 등록</span>
              </button>
            </form>

            <div className="grid-responsive">
              {roles.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-color)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a5b4fc' }}>{r.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.3rem 0 0.5rem 0' }}>{r.description}</div>
                  <div className="currency-badge" style={{ fontSize: '0.8rem' }}>
                    + {r.dailyReward} 꿈돈 & EXP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🎁 Tab 3: 상점 관리 & 쿠폰 승인함 (Store & Approvals) */}
      {activeTab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 3-1: 학생들의 쿠폰 사용 승인 요청함 */}
          <div className="glass-card" style={{ borderColor: pendingApprovals.length > 0 ? 'rgba(245, 158, 11, 0.4)' : undefined }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 className="w-5 h-5" />
              <span>학생 쿠폰 사용 요청 승인함 ({pendingApprovals.length}건)</span>
            </h3>

            {pendingApprovals.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '1rem 0' }}>대기 중인 쿠폰 사용 승인 요청이 없습니다.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pendingApprovals.map((p) => {
                  const student = students.find((s) => s.id === p.studentId);
                  return (
                    <div
                      key={p.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
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
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                          {student ? `${student.id}번 ${student.name}` : `학생 ID ${p.studentId}`} - 『{p.itemTitle}』
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          구매일: {p.purchasedAt}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onRejectCoupon(p.id)}
                        >
                          <X className="w-4 h-4" />
                          <span>거절</span>
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => onApproveCoupon(p.id)}
                        >
                          <Check className="w-4 h-4" />
                          <span>사용 승인</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3-2: 상점 상품 등록 및 목록 */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              상점 상품/쿠폰 등록 및 관리
            </h3>

            {/* Add Item Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newItemTitle.trim()) return;
                onAddStoreItem({
                  title: newItemTitle.trim(),
                  price: Number(newItemPrice),
                  category: newItemCategory,
                  stock: Number(newItemStock),
                  description: newItemDesc.trim()
                });
                setNewItemTitle('');
                setNewItemPrice(500);
                setNewItemStock(10);
                setNewItemDesc('');
              }}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label className="form-label">상품명 (이모지 포함)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 🪑 1일 자리 지정권"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">판매 가격 (꿈돈)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">카테고리</label>
                <select
                  className="form-select"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                >
                  <option value="coupon">쿠폰</option>
                  <option value="item">실물 물품</option>
                </select>
              </div>

              <div>
                <label className="form-label">재고 수량</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={newItemStock}
                  onChange={(e) => setNewItemStock(e.target.value)}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">상품 설명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 하루 동안 내가 선택한 원하는 자리에 앉기"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success" style={{ gridColumn: '1 / -1' }}>
                <Plus className="w-4 h-4" />
                <span>새 상점 상품 추가하기</span>
              </button>
            </form>

            <div className="grid-responsive">
              {storeItems.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.3rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    {item.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 800 }}>🪙 {item.price}꿈돈</span>
                    <span style={{ color: '#10b981' }}>재고 {item.stock}개</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Tab 4: 일일 미션 관리 (Missions) */}
      {activeTab === 'missions' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            학급 공통 일일 미션 설정
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newMissionTitle.trim()) return;
              onAddMission({
                title: newMissionTitle.trim(),
                rewardBalance: Number(newMissionReward),
                rewardExp: Number(newMissionReward)
              });
              setNewMissionTitle('');
              setNewMissionReward(50);
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              alignItems: 'end'
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <label className="form-label">새 학급 미션 제목</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 📖 아침 독서 10분 온전히 몰입하기"
                value={newMissionTitle}
                onChange={(e) => setNewMissionTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ width: 140 }}>
              <label className="form-label">보상 (꿈돈/EXP)</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={newMissionReward}
                onChange={(e) => setNewMissionReward(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success">
              <Plus className="w-4 h-4" />
              <span>미션 등록</span>
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {missions.map((m) => (
              <div
                key={m.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.title}</div>
                <div className="currency-badge">+{m.rewardBalance} 꿈돈 & EXP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔄 Tab 5: 데이터 초기화 / 리셋 (Settings) */}
      {activeTab === 'settings' && (
        <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert className="w-5 h-5" />
            <span>학급 데이터 초기화 (Reset Data)</span>
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            학급 데이터(25명 학생 화폐, 경험치, 1인 1역 배정, 상점 목록 등)를 초기 기본 샘플 데이터 상태로 리셋합니다.
          </p>

          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('정말로 모든 학급 데이터를 초기 샘플 데이터로 리셋하시겠습니까?')) {
                onResetData();
              }
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>학급 데이터 전체 초기화하기</span>
          </button>
        </div>
      )}
    </div>
  );
}
