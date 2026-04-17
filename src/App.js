import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'http://yds.it';

function App() {
    const [selectedShop, setSelectedShop] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);

    // 지하철 필터 상태
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedStationCd, setSelectedStationCd] = useState('');

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const infoRef = useRef(null);

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
            setSelectedStationCd('');
        }
    }, [selectedLine]);

    // 지도 초기화
    useEffect(() => {
        const kakao = window.kakao;
        if (kakao && kakao.maps) {
            const container = mapRef.current;
            const options = {
                center: new kakao.maps.LatLng(37.5607, 126.9738),
                level: 4,
            };
            mapInstance.current = new kakao.maps.Map(container, options);
        }
    }, []);

    // 마커 표시
    useEffect(() => {
        const kakao = window.kakao;
        if (!kakao || !mapInstance.current || !selectedShop) return;
        if (!selectedShop.latitude || !selectedShop.longitude) return;

        const moveLatLng = new kakao.maps.LatLng(selectedShop.latitude, selectedShop.longitude);
        mapInstance.current.setCenter(moveLatLng);

        if (markerRef.current) markerRef.current.setMap(null);
        if (infoRef.current) infoRef.current.close();

        markerRef.current = new kakao.maps.Marker({ position: moveLatLng, map: mapInstance.current });

        const displayName = selectedShop.rmk
            ? `${selectedShop.shopNm}(${selectedShop.rmk})`
            : selectedShop.shopNm;

        infoRef.current = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;white-space:nowrap;">${displayName}</div>`
        });
        infoRef.current.open(mapInstance.current, markerRef.current);
    }, [selectedShop]);

    // 식당 선택
// 식당 랜덤 선택 버튼 클릭 시 실행되는 함수
    const handleSelectShop = async () => {
        try {
            // [중요] stationCd 파라미터 이름을 백엔드와 동일하게 맞춰야 함
            const url = selectedStationCd
                ? `${API_BASE}/api/shops?stationCd=${selectedStationCd}`
                : `${API_BASE}/api/shops`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 0) {
                alert('이 역 근처에는 등록된 식당이 없습니다!');
                return;
            }

            const randomIndex = Math.floor(Math.random() * data.length);
            setSelectedShop(data[randomIndex]);
        } catch (error) {
            console.error('API 호출 실패:', error);
            alert('데이터를 가져오지 못했습니다.');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${API_BASE}/api/shops/upload`, { method: 'POST', body: formData });
            const result = await response.json();
            setUploadResult(result);
            alert(result.message);
        } catch (error) {
            alert('업로드 실패');
        }
        e.target.value = '';
    };

    return (
        <div className="App" style={{ textAlign: 'center', paddingTop: '30px' }}>
            <h1>🍚 점심 뭐 먹지?</h1>
            <div ref={mapRef} style={{ width: '90%', maxWidth: '600px', height: '350px', margin: '20px auto', borderRadius: '12px', border: '2px solid #ddd' }} />

            <div style={{ margin: '20px auto', fontSize: '32px', fontWeight: 'bold', minHeight: '45px' }}>
                {selectedShop ? `${selectedShop.shopNm}${selectedShop.rmk ? '(' + selectedShop.rmk + ')' : ''}` : '필터를 선택하고 버튼을 눌러주세요!'}
            </div>

            {/* 지하철 필터 영역 */}
            <div style={{ margin: '15px auto', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <select value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} style={{ padding: '10px', borderRadius: '8px' }}>
                    <option value="">호선 선택</option>
                    {lines.map((line, idx) => <option key={idx} value={line}>{line}</option>)}
                </select>
                <select value={selectedStationCd} onChange={(e) => setSelectedStationCd(e.target.value)} disabled={!selectedLine} style={{ padding: '10px', borderRadius: '8px' }}>
                    <option value="">역명 선택</option>
                    {stations.map(s => <option key={s.stationCd} value={s.stationCd}>{s.stationNm}</option>)}
                </select>
            </div>

            <button onClick={handleSelectShop} style={{ padding: '15px 40px', fontSize: '20px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginBottom: '30px' }}>
                🎲 식당 선택!
            </button>

            <div style={{ margin: '20px auto', padding: '20px', border: '2px dashed #ccc', width: '400px' }}>
                <h3>📂 가게 엑셀 업로드</h3>
                <input type="file" accept=".xlsx" onChange={handleFileUpload} />
                {uploadResult && <p style={{ marginTop: '10px', color: uploadResult.success ? 'green' : 'red' }}>{uploadResult.message}</p>}
            </div>
        </div>
    );
}

export default App;