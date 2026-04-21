import React, {useEffect, useState} from 'react';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : '';

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 이미 로그인 상태면 관리자 페이지로 이동
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/admin';
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(API_BASE + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password }),
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('userNm', result.userNm);
                localStorage.setItem('role', result.role);
                if (result.role === 'ADMIN') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('서버에 연결할 수 없습니다.');
        }
    };

    return (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1>🔐 로그인</h1>
            <form onSubmit={handleLogin} style={{ margin: '30px auto', maxWidth: '300px' }}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
                />
                <button
                    type="submit"
                    style={{ width: '100%', padding: '12px', backgroundColor: '#4472C4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
                >
                    로그인
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
            <a href="/signup" style={{ color: '#999', fontSize: '14px' }}>계정이 없으신가요? 회원가입</a>
        </div>
    );
}

export default Login;