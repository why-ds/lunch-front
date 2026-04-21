import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

function Signup() {
    const [form, setForm] = useState({ userId: '', password: '', passwordConfirm: '', userNm: '' });
    const [idChecked, setIdChecked] = useState(false);
    const [idMessage, setIdMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            window.location.href = '/';
        }
    }, []);

    const checkUserId = async () => {
        if (!form.userId.trim()) { setIdMessage('아이디를 입력해주세요.'); return; }
        try {
            const res = await fetch(`${API_BASE}/api/auth/check?userId=${form.userId}`);
            const data = await res.json();
            setIdChecked(!data.exists);
            setIdMessage(data.message);
        } catch (e) { setIdMessage('확인 실패'); }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.userId.trim()) { setError('아이디를 입력해주세요.'); return; }
        if (!idChecked) { setError('아이디 중복확인을 해주세요.'); return; }
        if (!form.password) { setError('비밀번호를 입력해주세요.'); return; }
        if (form.password.length < 4) { setError('비밀번호는 4자 이상이어야 합니다.'); return; }
        if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
        if (!form.userNm.trim()) { setError('이름을 입력해주세요.'); return; }

        try {
            const res = await fetch(API_BASE + '/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: form.userId,
                    password: form.password,
                    userNm: form.userNm
                }),
            });
            const result = await res.json();
            if (result.success) {
                alert(result.message);
                window.location.href = '/login';
            } else {
                setError(result.message);
            }
        } catch (e) { setError('서버에 연결할 수 없습니다.'); }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' };

    return (
        <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <h1>📝 회원가입</h1>
            <form onSubmit={handleSignup} style={{ margin: '30px auto', maxWidth: '300px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={form.userId}
                        onChange={(e) => { setForm({...form, userId: e.target.value}); setIdChecked(false); setIdMessage(''); }}
                        style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                    />
                    <button type="button" onClick={checkUserId} style={{
                        padding: '12px 16px', backgroundColor: '#4472C4', color: 'white',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '14px'
                    }}>중복확인</button>
                </div>
                {idMessage && (
                    <p style={{ fontSize: '13px', color: idChecked ? 'green' : 'red', margin: '0 0 10px 0', textAlign: 'left' }}>
                        {idMessage}
                    </p>
                )}
                <input type="password" placeholder="비밀번호 (4자 이상)" value={form.password}
                       onChange={(e) => setForm({...form, password: e.target.value})} style={inputStyle} />
                <input type="password" placeholder="비밀번호 확인" value={form.passwordConfirm}
                       onChange={(e) => setForm({...form, passwordConfirm: e.target.value})} style={inputStyle} />
                <input type="text" placeholder="이름" value={form.userNm}
                       onChange={(e) => setForm({...form, userNm: e.target.value})} style={inputStyle} />
                <button type="submit" style={{
                    width: '100%', padding: '12px', backgroundColor: '#4472C4', color: 'white',
                    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
                }}>가입하기</button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
            <a href="/login" style={{ color: '#999', fontSize: '14px' }}>이미 계정이 있으신가요? 로그인</a>
        </div>
    );
}

export default Signup;