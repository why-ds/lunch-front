import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function Profile() {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) { window.location.href = '/login'; return; }
        fetch(API_BASE + '/api/user/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, [token]);

    const infoStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' };

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
                        <span>{user.nickname}</span>
                    </div>
                    <div style={infoStyle}>
                        <span style={{ color: '#999' }}>이메일</span>
                        <span>{user.email}</span>
                    </div>
                    <div style={infoStyle}>
                        <span style={{ color: '#999' }}>가입일</span>
                        <span>{user.regDt ? user.regDt.substring(0, 10) : ''}</span>
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