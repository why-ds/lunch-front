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