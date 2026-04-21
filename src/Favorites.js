import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function Favorites() {
    const token = localStorage.getItem('token');
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!token) { window.location.href = '/login'; return; }
        loadFavorites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

    const loadFavorites = async () => {
        try {
            const res = await fetch(API_BASE + '/api/user/favorites', { headers });
            if (res.ok) setFavorites(await res.json());
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

    const filtered = favorites.filter(f =>
        f.shopNm.includes(search) || (f.address && f.address.includes(search)) || (f.rmk && f.rmk.includes(search))
    );

    const itemStyle = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 15px', borderBottom: '1px solid #eee'
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <h2>⭐ 즐겨찾기 ({favorites.length})</h2>
            <input
                type="text" placeholder="가게명, 주소 검색..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box', marginBottom: '15px' }}
            />
            <div style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
                {filtered.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
                        {search ? '검색 결과가 없습니다.' : '등록된 즐겨찾기가 없습니다.'}
                    </p>
                ) : (
                    filtered.map(fav => (
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
            <button onClick={() => window.location.href = '/mypage'} style={{
                width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#95a5a6', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
            }}>
                ← 돌아가기
            </button>
        </div>
    );
}

export default Favorites;