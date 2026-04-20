import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function LandmarkExcelUpload() {
    const token = localStorage.getItem('token');
    const [result, setResult] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => { if (!token) window.location.href = '/login'; }, [token]);

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) { alert('파일을 선택해주세요!'); return; }
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const res = await fetch(API_BASE + '/api/landmarks/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData,
            });
            const data = await res.json();
            setResult(data);
            alert(data.message);
            setSelectedFile(null);
        } catch (e) { alert('업로드 실패'); }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px', textAlign: 'center' }}>
            <h2>📂 랜드마크 엑셀 업로드</h2>
            <a href="/sample_landmark.xlsx" download="sample_landmark.xlsx" style={{ color: '#E67E22', fontSize: '14px' }}>
                📥 업로드 양식 다운로드
            </a>
            <div style={{ margin: '30px 0', padding: '40px', border: '2px dashed #E67E22', borderRadius: '10px' }}>
                <p style={{ marginBottom: '20px', color: '#666' }}>엑셀 파일(.xlsx)을 선택해주세요</p>
                <input type="file" accept=".xlsx" onChange={handleFileSelect} />
                {selectedFile && (
                    <p style={{ marginTop: '10px', color: '#333' }}>📄 {selectedFile.name}</p>
                )}
                {result && <p style={{ marginTop: '15px', color: result.success ? 'green' : 'red' }}>{result.message}</p>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => window.location.href = '/admin'} style={{ flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                    ← 돌아가기
                </button>
                <button onClick={handleUpload} disabled={!selectedFile} style={{ flex: 1, padding: '12px', backgroundColor: selectedFile ? '#E67E22' : '#bdc3c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: selectedFile ? 'pointer' : 'default' }}>
                    저장
                </button>
            </div>
        </div>
    );
}

export default LandmarkExcelUpload;