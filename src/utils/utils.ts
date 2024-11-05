import React, {useCallback} from "react";

// 이메일
export function extractUserFromEmail(email: string): string {
    return email.split("@")[0];
}

// 날짜
export function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 컬럼 Key 값 자르기
export const findColumnInfo = (columnKey: string) => {
    // 정규 표현식을 업데이트하여 새로운 데이터 형식에 맞게 처리
    const matches = columnKey.match(/ColumnResponse\(id=(\d+), name=([\w\s\uAC00-\uD7AF]+), type=(\w+), columnHash=([\w\d]+), tableID=(\d+), isPk=(true|false), isUk=(true|false), isFk=(true|false), isNotNull=(true|false), joinTableHash=(\w*|null)\)/);

    if (matches) {
        return {
            columnID: parseInt(matches[1]),
            name: matches[2],
            type: matches[3],
            columnHash: matches[4],
            tableID: parseInt(matches[5]),
            isPk: matches[6] === 'true',
            isUk: matches[7] === 'true',
            isFk: matches[8] === 'true',
            isNotNull: matches[9] === 'true',
            joinTableHash: matches[10] === 'null' ? null : matches[10]
        };
    }

    // 기본 값으로 반환
    return {
        columnID: 0,
        name: "",
        type: "",
        columnHash: "",
        tableID: 0,
        isPk: false,
        isUk: false,
        isFk: false,
        isNotNull: false,
        joinTableHash: null
    };
};


// 함수 훅
export function useConfirm(onConfirm: () => void | null) {
    // 확인 버튼 클릭 시 호출될 함수
    return useCallback(() => {
        onConfirm(); // 전달받은 onConfirm 함수 호출
    }, [onConfirm]);
}

// 파일 다운로드
export const downloadFile = (fileBlob: Blob, fileName: string) => {
    // Blob URL 생성
    const url = URL.createObjectURL(fileBlob);

    // 임시 링크 요소를 생성하여 파일 다운로드를 트리거
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName; // 파일 이름 설정

    // 링크를 문서에 추가하고 클릭하여 다운로드
    document.body.appendChild(a);
    a.click();

    // 다운로드 후 링크 및 Blob URL을 정리
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// url 자르기
export const extractLastSegment = (url: string): string => {
    const segments = url.split('/');
    return segments[segments.length - 1];
};

// 복사 기능
export const copyToClipboard = (text: string, callback?: () => void) => {
    if (navigator.clipboard !== undefined) {
        navigator.clipboard.writeText(text).then(() => {
            if (callback) callback();
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            if (callback) callback();
        } catch (err) {
            console.error('복사 실패', err);
        }
        textArea.setSelectionRange(0, 0);
        document.body.removeChild(textArea);
    }
};