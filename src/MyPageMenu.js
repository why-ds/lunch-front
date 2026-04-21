import React, { useEffect } from 'react';

function MyPageMenu() {
    const token = localStorage.getItem('token');
    const userNm = localStorage.getItem('userNm');

    useEffect(() => {
        if (!token) window.location.href = '/login';
    }, [token]);

    const menuStyle = {
        display: 'block', width: '100%', padding: '20px', margin: '10px 0',
        fontSize: '18px', border: '2px solid #ddd', borderRadius: '10px',
        backgroundColor: 'white', cursor: 'pointer', textAlign: 'left'
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>👤 마이페이지</h1>
                <button onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    로그아웃
                </button>
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>{userNm}님 환영합니다!</p>

            <button style={menuStyle} onClick={() => window.location.href = '/mypage/profile'}>
                👤 회원정보
            </button>
            <button style={menuStyle} onClick={() => window.location.href = '/mypage/favorites'}>
                ⭐ 즐겨찾기
            </button>
            <button style={menuStyle} onClick={() => window.location.href = '/mypage/blacklist'}>
                🚫 블랙리스트
            </button>

            <button onClick={() => window.location.href = '/'} style={{
                marginTop: '20px', padding: '12px 30px', backgroundColor: '#4472C4', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
            }}>
                🍚 메인 페이지로
            </button>
        </div>
    );
}

export default MyPageMenu;