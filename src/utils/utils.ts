import {useCallback} from "react";

export function extractUserFromEmail(email: string): string {
    return email.split("@")[0];
}

export function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 컬럼 Key 값 자르기
export const findColumnInfo = (columnKey: string) => {
    const matches = columnKey.match(/ColumnResponse\(id=(\d+), name=([\w\s\uAC00-\uD7AF]+), type=(\w+), tableID=(\d+), columnHash=([\w\d]+)\)/);
    if (matches) {
        return {
            columnID: parseInt(matches[1]),
            name: matches[2],
            type: matches[3],
            tableID: parseInt(matches[4]),
            columnHash: matches[5]
        };
    }

    return { columnID: 0, name: "", type: "", tableID: 0, columnHash: "" }; // Default values
};

// 함수 훅
export function useConfirm(onConfirm: () => void | null) {
    // 확인 버튼 클릭 시 호출될 함수
    return useCallback(() => {
        onConfirm(); // 전달받은 onConfirm 함수 호출
    }, [onConfirm]);
}
