import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

function Admin() {
    const [uploadResult, setUploadResult] = useState(null);
    const [landmarkResult, setLandmarkResult] = useState(null);
    const token = localStorage.getItem('token');
    const userNm = localStorage.getItem('userNm');

    // 가게 단건 입력 상태
    const [shopForm, setShopForm] = useState({
        shopNm: '', stationCd: '', foodTypeCd: '', address: '', rmk: ''
    });

    // 랜드마크 단건 입력 상태
    const [landmarkForm, setLandmarkForm] = useState({
        landmarkCd: '', landmarkNm: '', address: ''
    });

    // 역 목록 (드롭다운용)
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedLine, setSelectedLine] = useState('');

    // 음식종류 코드
    const foodTypes = [
        { cd: 'F01', nm: '한식' }, { cd: 'F02', nm: '중식' },
        { cd: 'F03', nm: '일식' }, { cd: 'F04', nm: '양식' },
        { cd: 'F05', nm: '분식' }, { cd: 'F06', nm: '동남아' },
    ];

    // 로그인 체크
    useEffect(() => {
        if (!token) window.location.href = '/login';
    }, [token]);

    // 호선 로드
    useEffect(() => {
        fetch(`${API_BASE}/api/subway-stations/lines`)
            .then(res => res.json())
            .then(data => setLines(data))
            .catch(err => console.error('호선 로드 실패:', err));
    }, []);

    // 역 로드
    useEffect(() => {
        if (selectedLine) {
            fetch(`${API_BASE}/api/subway-stations?lineNm=${encodeURIComponent(selectedLine)}`)
                .then(res => res.json())
                .then(data => setStations(data))
                .catch(err => console.error('역 로드 실패:', err));
        } else {
            setStations([]);
        }
    }, [selectedLine]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    // 다음 주소 검색 (가게용)
    const searchShopAddress = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                setShopForm({ ...shopForm, address: data.roadAddress || data.jibunAddress });
            }
        }).open();
    };

    // 다음 주소 검색 (랜드마크용)
    const searchLandmarkAddress = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                setLandmarkForm({ ...landmarkForm, address: data.roadAddress || data.jibunAddress });
            }
        }).open();
    };

    // 가게 단건 등록
    const handleShopSubmit = async () => {
        if (!shopForm.shopNm) { alert('가게명을 입력해주세요!'); return; }
        if (!shopForm.foodTypeCd) { alert('음식종류를 선택해주세요!'); return; }

        try {
            const response = await fetch(API_BASE + '/api/shops/single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(shopForm),
            });
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                setShopForm({ shopNm: '', stationCd: '', foodTypeCd: '', address: '', rmk: '' });
                setSelectedLine('');
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('등록 실패');
        }
    };

    // 랜드마크 단건 등록
    const handleLandmarkSubmit = async () => {
        if (!landmarkForm.landmarkCd) { alert('랜드마크코드를 입력해주세요!'); return; }
        if (!landmarkForm.landmarkNm) { alert('랜드마크명을 입력해주세요!'); return; }

        try {
            const response = await fetch(API_BASE + '/api/landmarks/single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(landmarkForm),
            });
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                setLandmarkForm({ landmarkCd: '', landmarkNm: '', address: '' });
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('등록 실패');
        }
    };

    // 가게 엑셀 업로드
    const handleShopUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(API_BASE + '/api/shops/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
            });
            const result = await response.json();
            setUploadResult(result);
            alert(result.message);
        } catch (error) {
            alert('업로드 실패');
        }
        e.target.value = '';
    };

    // 랜드마크 엑셀 업로드
    const handleLandmarkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(API_BASE + '/api/landmarks/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
            });
            const result = await response.json();
            setLandmarkResult(result);
            alert(result.message);
        } catch (error) {
            alert('랜드마크 업로드 실패');
        }
        e.target.value = '';
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };
    const selectStyle = { ...inputStyle, backgroundColor: 'white' };
    const btnStyle = { padding: '10px 20px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' };

    return (
        <div style={{ textAlign: 'center', paddingTop: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>⚙️ 관리자</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{userNm}님</span>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        로그아웃
                    </button>
                </div>
            </div>

            {/* 가게 단건 등록 */}
            <div style={{ margin: '15px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'left' }}>
                <h3>🍚 가게 등록</h3>
                <input style={inputStyle} placeholder="가게명 *" value={shopForm.shopNm}
                       onChange={(e) => setShopForm({...shopForm, shopNm: e.target.value})} />
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <select style={{...selectStyle, flex: 1}} value={selectedLine}
                            onChange={(e) => { setSelectedLine(e.target.value); setShopForm({...shopForm, stationCd: ''}); }}>
                        <option value="">호선</option>
                        {lines.map((l, i) => <option key={i} value={l}>{l}</option>)}
                    </select>
                    <select style={{...selectStyle, flex: 1}} value={shopForm.stationCd}
                            onChange={(e) => setShopForm({...shopForm, stationCd: e.target.value})} disabled={!selectedLine}>
                        <option value="">역 선택</option>
                        {stations.map(s => <option key={s.stationCd} value={s.stationCd}>{s.stationNm}</option>)}
                    </select>
                </div>
                <select style={selectStyle} value={shopForm.foodTypeCd}
                        onChange={(e) => setShopForm({...shopForm, foodTypeCd: e.target.value})}>
                    <option value="">음식종류 선택 *</option>
                    {foodTypes.map(f => <option key={f.cd} value={f.cd}>{f.nm}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input style={{...inputStyle, flex: 1, marginBottom: 0}} placeholder="주소 (검색 버튼 클릭)" value={shopForm.address}
                           onChange={(e) => setShopForm({...shopForm, address: e.target.value})} />
                    <button onClick={searchShopAddress} style={{...btnStyle, backgroundColor: '#27ae60', whiteSpace: 'nowrap'}}>🔍 검색</button>
                </div>
                <input style={inputStyle} placeholder="비고 (메뉴 등)" value={shopForm.rmk}
                       onChange={(e) => setShopForm({...shopForm, rmk: e.target.value})} />
                <button onClick={handleShopSubmit} style={{...btnStyle, width: '100%'}}>가게 등록</button>
            </div>

            {/* 랜드마크 단건 등록 */}
            <div style={{ margin: '15px 0', padding: '20px', border: '1px solid #E67E22', borderRadius: '10px', textAlign: 'left' }}>
                <h3>🏢 랜드마크 등록</h3>
                <input style={inputStyle} placeholder="랜드마크코드 * (예: LM0001)" value={landmarkForm.landmarkCd}
                       onChange={(e) => setLandmarkForm({...landmarkForm, landmarkCd: e.target.value})} />
                <input style={inputStyle} placeholder="랜드마크명 *" value={landmarkForm.landmarkNm}
                       onChange={(e) => setLandmarkForm({...landmarkForm, landmarkNm: e.target.value})} />
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input style={{...inputStyle, flex: 1, marginBottom: 0}} placeholder="주소 (검색 버튼 클릭)" value={landmarkForm.address}
                           onChange={(e) => setLandmarkForm({...landmarkForm, address: e.target.value})} />
                    <button onClick={searchLandmarkAddress} style={{...btnStyle, backgroundColor: '#E67E22', whiteSpace: 'nowrap'}}>🔍 검색</button>
                </div>
                <button onClick={handleLandmarkSubmit} style={{...btnStyle, width: '100%', backgroundColor: '#E67E22'}}>랜드마크 등록</button>
            </div>

            {/* 엑셀 업로드 영역 */}
            <div style={{ margin: '15px 0', padding: '20px', border: '2px dashed #ccc', borderRadius: '10px' }}>
                <h3>📂 가게 엑셀 업로드</h3>
                <input type="file" accept=".xlsx" onChange={handleShopUpload} />
                {uploadResult && <p style={{ color: uploadResult.success ? 'green' : 'red' }}>{uploadResult.message}</p>}
            </div>

            <div style={{ margin: '15px 0', padding: '20px', border: '2px dashed #E67E22', borderRadius: '10px' }}>
                <h3>🏢 랜드마크 엑셀 업로드</h3>
                <input type="file" accept=".xlsx" onChange={handleLandmarkUpload} />
                {landmarkResult && <p style={{ color: landmarkResult.success ? 'green' : 'red' }}>{landmarkResult.message}</p>}
            </div>

            <button onClick={() => window.location.href = '/'} style={{...btnStyle, marginTop: '10px', marginBottom: '30px'}}>🍚 메인 페이지로</button>
        </div>
    );
}

export default Admin;