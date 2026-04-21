import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function Blacklist() {
    const token = localStorage.getItem('token');
    const [blacklist, setBlacklist] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!token) { window.location.href = '/login'; return; }
        loadBlacklist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

    const loadBlacklist = async () => {
        try {
            const res = await fetch(API_BASE + '/api/user/blacklist', { headers });
            if (res.ok) setBlacklist(await res.json());
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

    const filtered = blacklist.filter(b =>
        b.shopNm.includes(search) || (b.address && b.address.includes(search)) || (b.rmk && b.rmk.includes(search))
    );

    const itemStyle = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 15px', borderBottom: '1px solid #eee'
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
            <h2>🚫 블랙리스트 ({blacklist.length})</h2>
            <input
                type="text" placeholder="가게명, 주소 검색..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box', marginBottom: '15px' }}
            />
            <div style={{ border: '1px solid #ddd', borderRadius: '10px' }}>
                {filtered.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
                        {search ? '검색 결과가 없습니다.' : '등록된 블랙리스트가 없습니다.'}
                    </p>
                ) : (
                    filtered.map(black => (
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