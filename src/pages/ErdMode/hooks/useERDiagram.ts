import {useTable} from "../../../contexts/TableContext";
import {useRef, useState} from "react";
import * as go from "gojs";
import {findColumnInfo} from "../../../utils/utils";
import {tableRelationConnect} from "../../../services/api";
import ERDiagram from "../Components/ERDiagram";

export const useERDiagram = () => {
    const { setTables } = useTable();

    const diagramInstanceRef = useRef<go.Diagram | null>(null);
    const deletedLinksRef = useRef<any[]>([]); // 삭제된 링크를 저장할 참조

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    // 관계 연결 유효성 검사
    const validateLink = (parentTable: TableData, childTable: TableData): string | null => {
        let parentTableType = '';
        let childTableType = '';

        const isParentTableValid = Object.entries(parentTable.tableInnerStructure).some(([columnMeta, columnData]) => {
            const columnInfo = findColumnInfo(columnMeta);
            if (columnInfo.isPk) {
                parentTableType = columnInfo.type;
                return columnInfo.isPk; // 부모 테이블에 PK가 있는지 확인
            }
        });

        const isChildTableValid = Object.entries(childTable.tableInnerStructure).some(([columnMeta, columnData]) => {
            const columnInfo = findColumnInfo(columnMeta);

            if (columnInfo.isFk) {
                childTableType = columnInfo.type;
                return columnInfo.isFk; // 자식 테이블에 FK가 있는지 확인
            }
        });

        if (!isParentTableValid) return "부모 테이블에 PK가 존재하지 않습니다.";
        if (!isChildTableValid) return "자식 테이블에 FK가 존재하지 않습니다.";
        if (parentTableType !== childTableType) return "PK와 FK의 타입이 일치하지 않습니다.";

        return null;
    };

    // 관계 선 추가 통신
    const handelFetchRelationAdd = async (relationRequest: RelationRequest) => {
        try {
            const response = await tableRelationConnect(relationRequest);
            console.log('response', response);
            setTables(response);

        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };


    // 삭제 했던 선 복원
    const restoreDeletedLinks = () => {
        if (!diagramInstanceRef.current) return; // 다이어그램이 초기화되지 않았다면 조기 반환

        const model = diagramInstanceRef.current.model as go.GraphLinksModel;
        deletedLinksRef.current.forEach(link => {
            model.addLinkData(link); // 삭제된 링크를 모델에 다시 추가
        });
        deletedLinksRef.current = []; // 복원 후 배열 비우기
    };

    // 선 삭제 통신
    const handelFetchDeletedLink = async () => {
        deletedLinksRef.current.forEach(link => {
            console.log('선 삭제 로직 link:', link)
        });
        deletedLinksRef.current = []; // 복원 후 배열 비우기
    }

    // 데이터 변환 함수
    const transformTableData = (tableData: TableData[]): ERDiagram => {
        const nodes: any[] = [];
        const links: any[] = [];

        for (const table of tableData) {
            const nodeColumns = Object.entries(table.tableInnerStructure).flatMap(([columnMeta, columnData]) => {
                const columnInfo = findColumnInfo(columnMeta);

                return {
                    name: columnInfo.name,
                    type: columnInfo.type,
                    keyName: columnInfo.isPk ? 'PK' : (columnInfo.isUk ? 'UK' : (columnInfo.isFk ? 'FK' : null)),
                    nullLabel: columnInfo.isNotNull
                };
            });

            nodes.push({
                key: table.id!,
                name: table.name!,
                columns: nodeColumns
            });

            for (const [columnMeta, columnData] of Object.entries(table.tableInnerStructure)) {
                const columnInfo = findColumnInfo(columnMeta);
                if (columnInfo.joinTableHash && columnInfo.joinTableHash !== 'null') {
                    const fromTable = tableData.find(t => t.tableHash === columnInfo.joinTableHash);
                    if (fromTable) {
                        links.push({
                            from: fromTable.id,
                            to: table.id
                        });
                    }
                }
            }
        }

        return { node: nodes, linkData: links };
    };

    return {
        hooks: {
            diagramInstanceRef,
            errorMessage,
            setErrorMessage,
            questionMessage,
            setQuestionMessage,
            restoreDeletedLinks,
            handelFetchDeletedLink,
        },
        handles: {
            transformTableData,
            validateLink,
            handelFetchRelationAdd,
        }
    };
};

