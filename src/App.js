import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

function App() {
    const [selectedShop, setSelectedShop] = useState(null);

    // 지하철 필터 상태
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedStationCd, setSelectedStationCd] = useState('');

    // 랜드마크 필터 상태
    const [landmarks, setLandmarks] = useState([]);
    const [selectedLandmark, setSelectedLandmark] = useState(null);

    // 필터 모드: 'station' 또는 'landmark'
    const [filterMode, setFilterMode] = useState('station');

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const infoRef = useRef(null);
    // 랜드마크 필터 상태 추가
    const [sidos, setSidos] = useState([]);
    const [guguns, setGuguns] = useState([]);
    const [selectedSido, setSelectedSido] = useState('');
    const [selectedGugun, setSelectedGugun] = useState('');
    // 음식종류 필터 추가
    const [foodTypes, setFoodTypes] = useState([]);
    const [selectedFoodType, setSelectedFoodType] = useState('');

    // 시도 로드
    useEffect(() => {
        fetch(`${API_BASE}/api/landmarks/sidos`)
            .then(res => res.json())
            .then(data => setSidos(data))
            .catch(err => console.error('시도 로드 실패:', err));
    }, []);

    // 구군 로드
    useEffect(() => {
        if (selectedSido) {
            fetch(`${API_BASE}/api/landmarks/guguns?sidoNm=${encodeURIComponent(selectedSido)}`)
                .then(res => res.json())
                .then(data => setGuguns(data))
                .catch(err => console.error('구군 로드 실패:', err));
        } else {
            setGuguns([]);
            setSelectedGugun('');
            setSelectedLandmark(null);
        }
    }, [selectedSido]);

    // 랜드마크 로드 (구군 선택 시)
    useEffect(() => {
        if (selectedGugun) {
            fetch(`${API_BASE}/api/landmarks/filter?gugunCd=${selectedGugun}`)
                .then(res => res.json())
                .then(data => setLandmarks(data))
                .catch(err => console.error('랜드마크 로드 실패:', err));
        } else {
            setLandmarks([]);
            setSelectedLandmark(null);
        }
    }, [selectedGugun]);

    // 음식 종류
    useEffect(() => {
        fetch(`${API_BASE}/api/codes/details?grpCd=FOOD_TYPE`)
            .then(res => res.json())
            .then(data => setFoodTypes(data))
            .catch(err => console.error('음식종류 로드 실패:', err));
    }, []);

    // 호선 로드
    useEffect(() => {
        fetch(`${API_BASE}/api/subway-stations/lines`)
            .then(res => res.json())
            .then(data => setLines(data))
            .catch(err => console.error('호선 로드 실패:', err));
    }, []);

    // 랜드마크 목록 로드
    useEffect(() => {
        fetch(`${API_BASE}/api/landmarks`)
            .then(res => res.json())
            .then(data => setLandmarks(data))
            .catch(err => console.error('랜드마크 로드 실패:', err));
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

    // 식당 랜덤 선택
    const handleSelectShop = async () => {
        try {
            let url;

            if (filterMode === 'station') {
                if (!selectedLine) {
                    alert('호선을 선택해주세요!');
                    return;
                }
                if (!selectedStationCd) {
                    alert('역을 선택해주세요!');
                    return;
                }
                url = `${API_BASE}/api/shops?stationCd=${selectedStationCd}`;
                if (selectedFoodType) {
                    url += `&foodTypeCd=${selectedFoodType}`;
                }
            } else {
                if (!selectedLandmark) {
                    alert('랜드마크를 선택해주세요!');
                    return;
                }
                url = `${API_BASE}/api/shops/nearby?lat=${selectedLandmark.latitude}&lng=${selectedLandmark.longitude}&radius=500`;
                if (selectedFoodType) {
                    url += `&foodTypeCd=${selectedFoodType}`;
                }
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 0) {
                alert(filterMode === 'station'
                    ? '이 역 근처에는 등록된 식당이 없습니다!'
                    : '이 랜드마크 반경 500m에 등록된 식당이 없습니다!');
                return;
            }

            const randomIndex = Math.floor(Math.random() * data.length);
            setSelectedShop(data[randomIndex]);
        } catch (error) {
            console.error('API 호출 실패:', error);
            alert('데이터를 가져오지 못했습니다.');
        }
    };

    // 필터 모드 변경
    const handleFilterModeChange = (mode) => {
        setFilterMode(mode);
        setSelectedShop(null);
        setSelectedLine('');
        setSelectedStationCd('');
        setSelectedFoodType('');
        setSelectedSido('');
        setSelectedGugun('');
        setSelectedLandmark(null);
    };

    // 카카오톡 공유
    const handleShare = () => {
        if (!selectedShop) {
            alert('먼저 식당을 선택해주세요!');
            return;
        }

        const kakao = window.Kakao;
        if (!kakao || !kakao.isInitialized()) {
            alert('카카오 SDK 초기화 실패');
            return;
        }

        kakao.Share.sendDefault({
            objectType: 'location',
            address: selectedShop.address || '주소 정보 없음',
            addressTitle: selectedShop.shopNm,
            content: {
                title: '🍚 오늘 점심은 ' + selectedShop.shopNm,
                description: selectedShop.rmk
                    ? selectedShop.rmk + ' | ' + (selectedShop.address || '')
                    : selectedShop.address || '',
                imageUrl: 'https://klunch.kr/favicon.ico',
                link: {
                    mobileWebUrl: 'https://klunch.kr',
                    webUrl: 'https://klunch.kr',
                },
            },
            buttons: [
                {
                    title: '카카오맵에서 보기',
                    link: {
                        mobileWebUrl: 'https://map.kakao.com/link/search/' + encodeURIComponent(selectedShop.shopNm + ' ' + (selectedShop.address || '')),
                        webUrl: 'https://map.kakao.com/link/search/' + encodeURIComponent(selectedShop.shopNm + ' ' + (selectedShop.address || '')),
                    },
                },
                {
                    title: '점심 뭐 먹지?',
                    link: {
                        mobileWebUrl: 'https://klunch.kr',
                        webUrl: 'https://klunch.kr',
                    },
                },
            ],
        });
    };

    return (
        <div className="App" style={{ textAlign: 'center', paddingTop: '30px' }}>
            <h1>점심진짜뭐먹지🍚</h1>
            <div ref={mapRef} style={{ width: '90%', maxWidth: '600px', height: '350px', margin: '20px auto', borderRadius: '12px', border: '2px solid #ddd' }} />

            <div style={{ margin: '20px auto', fontSize: '32px', fontWeight: 'bold', minHeight: '45px' }}>
                {selectedShop ? `${selectedShop.shopNm}${selectedShop.rmk ? '(' + selectedShop.rmk + ')' : ''}` : '랜덤뽑기🎲'}
            </div>

            {/* 필터 모드 선택 */}
            <div style={{ margin: '15px auto' }}>
                <button
                    onClick={() => handleFilterModeChange('station')}
                    style={{
                        padding: '10px 20px', margin: '5px', fontSize: '16px',
                        backgroundColor: filterMode === 'station' ? '#4472C4' : '#e0e0e0',
                        color: filterMode === 'station' ? 'white' : '#333',
                        border: 'none', borderRadius: '8px', cursor: 'pointer'
                    }}
                >🚇 역 기준</button>
                <button
                    onClick={() => handleFilterModeChange('landmark')}
                    style={{
                        padding: '10px 20px', margin: '5px', fontSize: '16px',
                        backgroundColor: filterMode === 'landmark' ? '#E67E22' : '#e0e0e0',
                        color: filterMode === 'landmark' ? 'white' : '#333',
                        border: 'none', borderRadius: '8px', cursor: 'pointer'
                    }}
                >🏢 랜드마크 기준</button>
            </div>

            {/* 지하철 필터 */}
            {filterMode === 'station' && (
                <div style={{ margin: '15px auto', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <select value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">호선 선택</option>
                        {lines.map((line, idx) => <option key={idx} value={line}>{line}</option>)}
                    </select>
                    <select value={selectedStationCd} onChange={(e) => setSelectedStationCd(e.target.value)} disabled={!selectedLine} style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">역명 선택</option>
                        {stations.map(s => <option key={s.stationCd} value={s.stationCd}>{s.stationNm}</option>)}
                    </select>
                    <select value={selectedFoodType} onChange={(e) => setSelectedFoodType(e.target.value)} style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">음식종류 전체</option>
                        {foodTypes.map(f => <option key={f.dtlCd} value={f.dtlCd}>{f.dtlNm}</option>)}
                    </select>
                </div>
            )}

            {/* 랜드마크 필터 */}
            {filterMode === 'landmark' && (
                <div style={{ margin: '15px auto', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <select value={selectedSido} onChange={(e) => { setSelectedSido(e.target.value); setSelectedGugun(''); setSelectedLandmark(null); }}
                            style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">시도 선택</option>
                        {sidos.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                    <select value={selectedGugun} onChange={(e) => { setSelectedGugun(e.target.value); setSelectedLandmark(null); }}
                            disabled={!selectedSido} style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">구군 선택</option>
                        {guguns.map((g, i) => <option key={i} value={g.gugunCd}>{g.gugunNm}</option>)}
                    </select>
                    <select value={selectedLandmark ? selectedLandmark.landmarkSeq : ''}
                            onChange={(e) => { const lm = landmarks.find(l => l.landmarkSeq === parseInt(e.target.value)); setSelectedLandmark(lm || null); }}
                            disabled={!selectedGugun} style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">랜드마크 선택</option>
                        {landmarks.map(lm => <option key={lm.landmarkSeq} value={lm.landmarkSeq}>{lm.landmarkNm}</option>)}
                    </select>
                    <select value={selectedFoodType} onChange={(e) => setSelectedFoodType(e.target.value)}
                            style={{ padding: '10px', borderRadius: '8px' }}>
                        <option value="">음식종류 전체</option>
                        {foodTypes.map(f => <option key={f.dtlCd} value={f.dtlCd}>{f.dtlNm}</option>)}
                    </select>
                    <span style={{ padding: '10px', fontSize: '14px', color: '#666' }}>반경 500m</span>
                </div>
            )}

            <button onClick={handleSelectShop} style={{
                padding: '15px 40px', fontSize: '20px',
                backgroundColor: filterMode === 'station' ? '#4472C4' : '#E67E22',
                color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginBottom: '10px'
            }}>
                🎲 식당 선택!
            </button>
            {selectedShop && (
                <button onClick={handleShare} style={{
                    padding: '15px 20px', fontSize: '20px',
                    backgroundColor: '#FEE500', color: '#3C1E1E',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    marginBottom: '30px'
                }}>
                    💬
                </button>
            )}
            {/* 관리자 링크 */}
            <div style={{ marginTop: '30px', paddingBottom: '30px' }}>
                <a href="/login" style={{ color: '#999', fontSize: '14px' }}>관리자 로그인</a>
            </div>
        </div>
    );
}

export default App;