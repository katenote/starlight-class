import React, { useState } from 'react';
import Header from './components/Header';
import LoginView from './components/LoginView';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import TransactionModal from './components/TransactionModal';
import Toast from './components/Toast';
import { loadAppData, saveAppData, getDefaultAppData, getLevelInfo } from './utils/defaultData';

export default function App() {
  const [appData, setAppData] = useState(() => loadAppData());
  
  // Current session user state: null (not logged in), or { role: 'teacher'|'student', studentId: number|null }
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('dream_class_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    targetStudentIds: []
  });

  // Sync state with LocalStorage
  const updateAppData = (newAppData) => {
    setAppData(newAppData);
    saveAppData(newAppData);
  };

  const addToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (userSession) => {
    setCurrentUser(userSession);
    try {
      sessionStorage.setItem('dream_class_current_user', JSON.stringify(userSession));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('dream_class_current_user');
    } catch (e) {
      console.error(e);
    }
    addToast('로그아웃 되었습니다.', 'info');
  };

  // Current selected student for student view
  const currentStudent = currentUser && currentUser.role === 'student'
    ? appData.students.find((s) => s.id === currentUser.studentId) || appData.students[0]
    : null;

  // Header user info helper
  const headerUserInfo = currentUser
    ? {
        role: currentUser.role,
        studentName: currentStudent ? currentStudent.name : null,
        username: currentStudent ? currentStudent.username : 'teacher'
      }
    : null;

  // 1. Transaction (Payment/Deduction) Handler
  const handleTransactionConfirm = ({ studentIds, amount, expAmount, reason }) => {
    const timestamp = new Date().toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newLogs = [...appData.logs];

    const updatedStudents = appData.students.map((s) => {
      if (studentIds.includes(s.id)) {
        const oldLevel = getLevelInfo(s.exp).level;
        const newBalance = Math.max(0, s.balance + amount);
        const newExp = Math.max(0, s.exp + (expAmount || 0));
        const newLevel = getLevelInfo(newExp).level;

        if (newLevel > oldLevel) {
          addToast(`🎉 ${s.name} 학생이 Lv.${newLevel}(으)로 레벨업 했습니다!`, 'success');
        }

        newLogs.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          amount,
          expAmount,
          reason,
          timestamp
        });

        return {
          ...s,
          balance: newBalance,
          exp: newExp
        };
      }
      return s;
    });

    updateAppData({
      ...appData,
      students: updatedStudents,
      logs: newLogs
    });

    addToast(
      `${studentIds.length}명 학생에게 화폐(${amount > 0 ? '+' : ''}${amount}꿈돈)가 반영되었습니다.`,
      'success'
    );
  };

  // 2. Complete Task Handler
  const handleCompleteTask = (studentId, taskId, taskTitle, rewardBalance, rewardExp) => {
    const student = appData.students.find((s) => s.id === studentId);
    if (!student) return;

    if (student.completedTasks?.includes(taskId)) {
      addToast('이미 완료한 미션입니다.', 'warning');
      return;
    }

    const timestamp = new Date().toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const oldLevel = getLevelInfo(student.exp).level;
    const newExp = student.exp + rewardExp;
    const newLevel = getLevelInfo(newExp).level;

    if (newLevel > oldLevel) {
      addToast(`🏆 축하합니다! Lv.${newLevel}(으)로 레벨업 했습니다!`, 'success');
    }

    const updatedStudents = appData.students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          balance: s.balance + rewardBalance,
          exp: newExp,
          completedTasks: [...(s.completedTasks || []), taskId]
        };
      }
      return s;
    });

    const newLogs = [
      {
        id: 'log_' + Date.now(),
        studentId,
        studentName: student.name,
        amount: rewardBalance,
        expAmount: rewardExp,
        reason: `[미션 완료] ${taskTitle}`,
        timestamp
      },
      ...appData.logs
    ];

    updateAppData({
      ...appData,
      students: updatedStudents,
      logs: newLogs
    });

    addToast(`보상 🪙 +${rewardBalance}꿈돈 & +${rewardExp} EXP 획득!`, 'success');
  };

  // 3. Buy Store Item Handler
  const handleBuyItem = (studentId, item) => {
    const student = appData.students.find((s) => s.id === studentId);
    if (!student) return;

    if (student.balance < item.price) {
      addToast('화폐 잔액이 부족합니다.', 'warning');
      return;
    }

    if (item.stock <= 0) {
      addToast('해당 상품은 품절되었습니다.', 'warning');
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];

    const updatedStudents = appData.students.map((s) => {
      if (s.id === studentId) {
        return { ...s, balance: s.balance - item.price };
      }
      return s;
    });

    const updatedStoreItems = appData.storeItems.map((i) => {
      if (i.id === item.id) {
        return { ...i, stock: i.stock - 1 };
      }
      return i;
    });

    const newPurchase = {
      id: 'p_' + Date.now(),
      studentId,
      itemId: item.id,
      itemTitle: item.title,
      price: item.price,
      purchasedAt: dateStr,
      status: 'active'
    };

    const newLogs = [
      {
        id: 'log_' + Date.now(),
        studentId,
        studentName: student.name,
        amount: -item.price,
        expAmount: 0,
        reason: `[상점 구매] ${item.title}`,
        timestamp: new Date().toLocaleString('ko-KR')
      },
      ...appData.logs
    ];

    updateAppData({
      ...appData,
      students: updatedStudents,
      storeItems: updatedStoreItems,
      purchases: [newPurchase, ...appData.purchases],
      logs: newLogs
    });

    addToast(`『${item.title}』 구매 완료! 쿠폰함에서 확인하세요.`, 'success');
  };

  // 4. Request Use Coupon Handler
  const handleUseCoupon = (purchaseId) => {
    const updatedPurchases = appData.purchases.map((p) => {
      if (p.id === purchaseId) {
        return { ...p, status: 'used_pending' };
      }
      return p;
    });

    updateAppData({
      ...appData,
      purchases: updatedPurchases
    });

    addToast('선생님께 쿠폰 사용 승인을 요청했습니다.', 'info');
  };

  // 5. Teacher Approve Coupon
  const handleApproveCoupon = (purchaseId) => {
    const updatedPurchases = appData.purchases.map((p) => {
      if (p.id === purchaseId) {
        return { ...p, status: 'used_approved' };
      }
      return p;
    });

    updateAppData({
      ...appData,
      purchases: updatedPurchases
    });

    addToast('쿠폰 사용을 승인했습니다.', 'success');
  };

  // 6. Teacher Reject Coupon
  const handleRejectCoupon = (purchaseId) => {
    const updatedPurchases = appData.purchases.map((p) => {
      if (p.id === purchaseId) {
        return { ...p, status: 'active' };
      }
      return p;
    });

    updateAppData({
      ...appData,
      purchases: updatedPurchases
    });

    addToast('쿠폰 사용 요청을 거절(재보유 처리)했습니다.', 'info');
  };

  // 7. Role Assignment Handler
  const handleUpdateRoleAssignment = (studentId, roleId) => {
    const updatedStudents = appData.students.map((s) => {
      if (s.id === studentId) {
        return { ...s, roleId };
      }
      return s;
    });

    updateAppData({
      ...appData,
      students: updatedStudents
    });

    addToast('1인 1역 배정이 수정되었습니다.', 'success');
  };

  // 8. Add Role
  const handleAddRole = (roleObj) => {
    const newRole = {
      id: 'r_' + Date.now(),
      ...roleObj
    };

    updateAppData({
      ...appData,
      roles: [...appData.roles, newRole]
    });

    addToast(`새 역할 『${roleObj.name}』(이)가 추가되었습니다.`, 'success');
  };

  // 9. Add Mission
  const handleAddMission = (missionObj) => {
    const newMission = {
      id: 'm_' + Date.now(),
      ...missionObj
    };

    updateAppData({
      ...appData,
      missions: [...appData.missions, newMission]
    });

    addToast(`새 미션 『${missionObj.title}』(이)가 추가되었습니다.`, 'success');
  };

  // 10. Add Store Item
  const handleAddStoreItem = (itemObj) => {
    const newItem = {
      id: 's_' + Date.now(),
      ...itemObj
    };

    updateAppData({
      ...appData,
      storeItems: [...appData.storeItems, newItem]
    });

    addToast(`새 상품 『${itemObj.title}』(이)가 등록되었습니다.`, 'success');
  };

  // 11. Reset Data
  const handleResetData = () => {
    const defaultData = getDefaultAppData();
    updateAppData(defaultData);
    addToast('학급 데이터가 초기 샘플 상태로 리셋되었습니다.', 'info');
  };

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* App Navigation Header */}
      <Header
        currentUser={headerUserInfo}
        onLogout={handleLogout}
      />

      {/* View Content: Login Screen vs Dashboard */}
      <main>
        {!currentUser ? (
          <LoginView
            students={appData.students}
            onLoginSuccess={handleLoginSuccess}
            addToast={addToast}
          />
        ) : currentUser.role === 'teacher' ? (
          <TeacherDashboard
            students={appData.students}
            roles={appData.roles}
            missions={appData.missions}
            storeItems={appData.storeItems}
            purchases={appData.purchases}
            logs={appData.logs}
            onOpenTransactionModal={(studentIds) =>
              setModalState({ isOpen: true, targetStudentIds: studentIds })
            }
            onUpdateRoleAssignment={handleUpdateRoleAssignment}
            onAddRole={handleAddRole}
            onAddMission={handleAddMission}
            onAddStoreItem={handleAddStoreItem}
            onApproveCoupon={handleApproveCoupon}
            onRejectCoupon={handleRejectCoupon}
            onResetData={handleResetData}
            addToast={addToast}
          />
        ) : (
          <StudentDashboard
            student={currentStudent}
            roles={appData.roles}
            missions={appData.missions}
            storeItems={appData.storeItems}
            purchases={appData.purchases}
            logs={appData.logs}
            onCompleteTask={handleCompleteTask}
            onBuyItem={handleBuyItem}
            onUseCoupon={handleUseCoupon}
            addToast={addToast}
          />
        )}
      </main>

      {/* Currency & EXP Transaction Modal */}
      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, targetStudentIds: [] })}
        targetStudentIds={modalState.targetStudentIds}
        students={appData.students}
        onConfirm={handleTransactionConfirm}
      />
    </div>
  );
}
