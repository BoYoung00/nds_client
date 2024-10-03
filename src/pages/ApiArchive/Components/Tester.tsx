import React, { useState } from 'react';
import styles from '../ApiArchive.module.scss';

const Tester: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [body, setBody] = useState<string>('');

    const handleRequest = async (method: string) => {
        try {
            const options: RequestInit = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            // POST, PUT 요청일 때 body 포함
            if (method === 'POST' || method === 'PUT') {
                options.body = body;
            }

            const res = await fetch(url, options);
            const contentType = res.headers.get('content-type');

            // JSON 응답일 때만 JSON 파싱
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                setResponse(JSON.stringify(data, null, 2));  // JSON 형식으로 결과를 출력
            } else {
                const text = await res.text();
                setResponse(text);  // 텍스트 형식의 응답 처리
            }
        } catch (error) {
            setResponse('Error: ' + error);
        }
    };

    return (
        <div className={styles.tester}>
            <p>API Tester</p>
            <span>URL:</span>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter API URL"
            />
            <div>
                <span>Body (for POST/PUT):</span>
                <textarea
                    style={{resize:'none'}}
                    rows={5}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter request body (JSON format)"
                />
            </div>
            <div className={styles.butBox}>
                <button onClick={() => handleRequest('GET')}>GET</button>
                <button onClick={() => handleRequest('POST')}>POST</button>
                <button onClick={() => handleRequest('PUT')}>PUT</button>
                <button onClick={() => handleRequest('DELETE')}>DELETE</button>
            </div>
            <div className={styles.responseBox}>
                <h3 style={{marginBottom: '0', fontSize: '1rem'}}>Response:</h3>
                <textarea
                    style={{resize:'none'}}
                    rows={7}
                    value={response}
                    placeholder='No result value yet'
                    readOnly
                />
            </div>
        </div>
    );
};

export default Tester;
