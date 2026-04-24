import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function Blacklist() {
    const token = localStorage.getItem('token');
    const [shops, setShops] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!token) { window.location.href = '/login'; return; }
        loadShops();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

    const loadShops = async () => {
        try {
            const res = await fetch(API_BASE + '/api/user/shops-with-blacklist', { headers });
            if (res.ok) setShops(await res.json());
        } catch (e) { console.error(e); }
    };

    const toggleBlacklist = async (shopSeq) => {
        try {
            await fetch(API_BASE + '/api/user/blacklist/toggle', {
                method: 'POST', headers,
                body: JSON.stringify({ shopSeq })
            });
            loadShops();
        } catch (e) { console.error(e); }
    };

    const filtered = shops.filter(s =>
        s.shopNm.includes(search) || (s.address && s.address.includes(search)) || (s.rmk && s.rmk.includes(search))
    );

    const blackCount = shops.filter(s => s.isBlacklisted).length;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <h2>🚫 블랙리스트 ({blackCount})</h2>
            <input
                type="text" placeholder="가게명, 주소, 메뉴 검색..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box', marginBottom: '15px' }}
            />
            <div style={{ border: '1px solid #ddd', borderRadius: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
                        {search ? '검색 결과가 없습니다.' : '등록된 가게가 없습니다.'}
                    </p>
                ) : (
                    filtered.map(shop => (
                        <div key={shop.shopSeq} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 15px', borderBottom: '1px solid #eee',
                            backgroundColor: shop.isBlacklisted ? '#FFEBEE' : 'white'
                        }}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>{shop.shopNm}</span>
                                {shop.rmk && <span style={{ color: '#999', marginLeft: '8px' }}>({shop.rmk})</span>}
                                <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{shop.address}</div>
                            </div>
                            <button onClick={() => toggleBlacklist(shop.shopSeq)}
                                    style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {shop.isBlacklisted ? '🚫' : '⭕'}
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

export default Blacklist;