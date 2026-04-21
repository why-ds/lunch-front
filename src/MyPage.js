import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function MyPage() {
    const token = localStorage.getItem('token');
    const userNm = localStorage.getItem('userNm');
    const [favorites, setFavorites] = useState([]);
    const [blacklist, setBlacklist] = useState([]);

    useEffect(() => {
        if (!token) { window.location.href = '/login'; return; }

        const loadData = async () => {
            try {
                const favRes = await fetch(API_BASE + '/api/user/favorites', { headers });
                if (favRes.ok) setFavorites(await favRes.json());

                const blackRes = await fetch(API_BASE + '/api/user/blacklist', { headers });
                if (blackRes.ok) setBlacklist(await blackRes.json());
            } catch (e) { console.error(e); }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

    const loadFavorites = async () => {
        try {
            const res = await fetch(API_BASE + '/api/user/favorites', { headers });
            if (res.ok) setFavorites(await res.json());
        } catch (e) { console.error(e); }
    };

    const loadBlacklist = async () => {
        try {
            const res = await fetch(API_BASE + '/api/user/blacklist', { headers });
            if (res.ok) setBlacklist(await res.json());
        } catch (e) { console.error(e); }
    };

    const toggleFavorite = async (shopSeq) => {
        try {
            await fetch(API_BASE + '/api/user/favorites/toggle', {
                method: 'POST', headers,
                body: JSON.stringify({ shopSeq })
            });
            loadFavorites();
        } catch (e) { console.error(e); }
    };

    const toggleBlacklist = async (shopSeq) => {
        try {
            await fetch(API_BASE + '/api/user/blacklist/toggle', {
                method: 'POST', headers,
                body: JSON.stringify({ shopSeq })
            });
            loadBlacklist();
        } catch (e) { console.error(e); }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const itemStyle = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 15px', borderBottom: '1px solid #eee'
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>👤 마이페이지</h1>
                <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    로그아웃
                </button>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>{userNm}님 환영합니다!</p>

            {/* 즐겨찾기 */}
            <div style={{ border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px' }}>
                <h3 style={{ padding: '15px', margin: 0, backgroundColor: '#FFF8E1', borderRadius: '10px 10px 0 0' }}>
                    ⭐ 즐겨찾기 ({favorites.length})
                </h3>
                {favorites.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>등록된 즐겨찾기가 없습니다.</p>
                ) : (
                    favorites.map(fav => (
                        <div key={fav.favSeq} style={itemStyle}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>{fav.shopNm}</span>
                                {fav.rmk && <span style={{ color: '#999', marginLeft: '8px' }}>({fav.rmk})</span>}
                                <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{fav.address}</div>
                            </div>
                            <button onClick={() => toggleFavorite(fav.shopSeq)}
                                    style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                ⭐
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* 블랙리스트 */}
            <div style={{ border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px' }}>
                <h3 style={{ padding: '15px', margin: 0, backgroundColor: '#FFEBEE', borderRadius: '10px 10px 0 0' }}>
                    🚫 블랙리스트 ({blacklist.length})
                </h3>
                {blacklist.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>등록된 블랙리스트가 없습니다.</p>
                ) : (
                    blacklist.map(black => (
                        <div key={black.blackSeq} style={itemStyle}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>{black.shopNm}</span>
                                {black.rmk && <span style={{ color: '#999', marginLeft: '8px' }}>({black.rmk})</span>}
                                <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{black.address}</div>
                            </div>
                            <button onClick={() => toggleBlacklist(black.shopSeq)}
                                    style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                🚫
                            </button>
                        </div>
                    ))
                )}
            </div>

            <button onClick={() => window.location.href = '/'} style={{
                width: '100%', padding: '12px', backgroundColor: '#4472C4', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
            }}>
                🍚 메인 페이지로
            </button>
        </div>
    );
}

export default MyPage;