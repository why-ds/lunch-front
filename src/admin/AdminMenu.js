import React, { useEffect } from 'react';

function AdminMenu() {
    const token = localStorage.getItem('token');
    const userNm = localStorage.getItem('userNm');

    useEffect(() => {
        if (!token) window.location.href = '/login';
    }, [token]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const menuStyle = {
        display: 'block', width: '100%', padding: '20px', margin: '10px 0',
        fontSize: '18px', border: '2px solid #ddd', borderRadius: '10px',
        backgroundColor: 'white', cursor: 'pointer', textAlign: 'left'
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>⚙️ 관리자</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{userNm}님</span>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        로그아웃
                    </button>
                </div>
            </div>

            <button style={menuStyle} onClick={() => window.location.href = '/admin/shop'}>
                🍚 가게 등록 (단건)
            </button>
            <button style={menuStyle} onClick={() => window.location.href = '/admin/shop-excel'}>
                📂 가게 등록 (엑셀)
            </button>
            <button style={menuStyle} onClick={() => window.location.href = '/admin/landmark'}>
                🏢 랜드마크 등록 (단건)
            </button>
            <button style={menuStyle} onClick={() => window.location.href = '/admin/landmark-excel'}>
                📂 랜드마크 등록 (엑셀)
            </button>

            <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                🍚 메인 페이지로
            </button>
        </div>
    );
}

export default AdminMenu;