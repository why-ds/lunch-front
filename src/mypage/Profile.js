import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function Profile() {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [nickChecked, setNickChecked] = useState(false);
    const [nickMessage, setNickMessage] = useState('');

    useEffect(() => {
        if (!token) { window.location.href = '/login'; return; }
        fetch(API_BASE + '/api/user/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, [token]);

    const checkNickname = async () => {
        if (!newNickname.trim()) { setNickMessage('닉네임을 입력해주세요.'); return; }
        if (newNickname.trim() === user.nickname) { setNickMessage('현재 닉네임과 동일합니다.'); return; }
        try {
            const res = await fetch(`${API_BASE}/api/auth/check-nickname?nickname=${encodeURIComponent(newNickname)}`);
            const data = await res.json();
            setNickChecked(!data.exists);
            setNickMessage(data.message);
        } catch (e) { setNickMessage('확인 실패'); }
    };

    const handleUpdateNickname = async () => {
        if (!nickChecked) { setNickMessage('중복확인을 해주세요.'); return; }
        try {
            const res = await fetch(API_BASE + '/api/user/nickname', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ nickname: newNickname })
            });
            const result = await res.json();
            if (result.success) {
                alert(result.message);
                localStorage.setItem('userNm', result.nickname);
                setUser({ ...user, nickname: result.nickname });
                setEditMode(false);
                setNickMessage('');
            } else {
                setNickMessage(result.message);
            }
        } catch (e) { setNickMessage('수정 실패'); }
    };

    const infoStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <h2>👤 회원정보</h2>
            {user ? (
                <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
                    <div style={infoStyle}>
                        <span style={{ color: '#999' }}>아이디</span>
                        <span>{user.userId}</span>
                    </div>
                    <div style={infoStyle}>
                        <span style={{ color: '#999' }}>닉네임</span>
                        {editMode ? (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <input type="text" value={newNickname}
                                       onChange={(e) => { setNewNickname(e.target.value); setNickChecked(false); setNickMessage(''); }}
                                       style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc', width: '120px', fontSize: '14px' }} />
                                <button onClick={checkNickname} style={{ padding: '6px 10px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                    중복확인
                                </button>
                                <button onClick={handleUpdateNickname} style={{ padding: '6px 10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                    저장
                                </button>
                                <button onClick={() => { setEditMode(false); setNickMessage(''); }} style={{ padding: '6px 10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                    취소
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{user.nickname}</span>
                                <button onClick={() => { setEditMode(true); setNewNickname(user.nickname); }}
                                        style={{ padding: '4px 8px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                    수정
                                </button>
                            </div>
                        )}
                    </div>
                    {nickMessage && <p style={{ fontSize: '13px', color: nickChecked ? 'green' : 'red', margin: '8px 0 0', textAlign: 'right' }}>{nickMessage}</p>}
                    <div style={infoStyle}>
                        <span style={{ color: '#999' }}>이메일</span>
                        <span>{user.email}</span>
                    </div>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}
            <button onClick={() => window.location.href = '/mypage'} style={{
                width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#95a5a6', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
            }}>
                ← 돌아가기
            </button>
        </div>
    );
}

export default Profile;