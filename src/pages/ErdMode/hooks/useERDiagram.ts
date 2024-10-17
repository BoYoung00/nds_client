import {useTable} from "../../../contexts/TableContext";
import {useEffect, useRef, useState} from "react";
import * as go from "gojs";
import {findColumnInfo} from "../../../utils/utils";
import {tableRelationConnect} from "../../../services/api";
import ERDiagram from "../Components/ERDiagram";
import {useDataBase} from "../../../contexts/DataBaseContext";

export const useERDiagram = () => {
    const { selectedDataBase } = useDataBase();
    const { setTables } = useTable();

    const diagramInstanceRef = useRef<go.Diagram | null>(null);
    const deletedLinksRef = useRef<any[]>([]); // 삭제된 링크를 저장할 참조
    const deletedLinkRef = useRef<any>(null); // 삭제할 링크

    const [selectedPkColumnHash, setSelectedPkColumnHash] = useState<string>(''); // PK Hash
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null); // 클릭 위치
    const [fkList, setFkList] = useState<{name: string, hash: string}[] | null>(null)
    const [selectedFkHash, setSelectedFkHash]  = useState<string | null>(null)

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
                setSelectedPkColumnHash(columnInfo.columnHash); // 선택한 PK 행 저장
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
            // console.log('response', response);
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

    // FK 목록 찾기
    const getForeignKeys = (table: TableData): { name: string; hash: string }[] => {
        const columns = Object.keys(table.tableInnerStructure);

        return columns
            .map((column) => {
                const columnInfo = findColumnInfo(column);
                // 외래키인 경우만 객체를 반환
                if (columnInfo.isFk) {
                    return {
                        name: columnInfo.name,
                        hash: columnInfo.columnHash,
                    };
                }
                return undefined;
            })
            .filter((fk) => fk !== undefined) as { name: string; hash: string }[]; // 타입 단언
    };

    // PK 찾기
    const getPrimaryKeyHash = (table: TableData): string => {
        const columns = Object.keys(table.tableInnerStructure);

        const pk = columns.find((column) => {
            const columnInfo = findColumnInfo(column);
            // 외래키인 경우만 객체를 반환
            if (columnInfo.isPk) {
                return columnInfo.columnHash
            }
            return undefined;
        })
        return pk ? pk : '';
    };

    // 메뉴 옵션 클릭 핸들러
    const handleMenuOptionClick = (hash: string) => {
        setSelectedFkHash(hash);
        handleDocumentClick();
    };

    // 메뉴 옵션 취소
    const handleMenuCancel = () => {
        handleDocumentClick();
        removeLink(deletedLinkRef.current); // 삭제 함수 호출
        resetState(); // 초기화
    }

    // 컨텍스트 메뉴 닫기
    const handleDocumentClick = () => { setContextMenu(null); };

    // 링크 삭제
    const removeLink = (linkData: any | null) => {
        const model = diagramInstanceRef.current?.model as go.GraphLinksModel;
        if (model) {
            model.removeLinkData(linkData);
            deletedLinkRef.current = null;
        }
    };

    // 마우스 클릭 후 위치 추적하여 컨텍스트 메뉴 위치 설정
    const handleMouseUp = (event: MouseEvent) => {
        // 마우스 오른쪽 클릭인 경우에만 메뉴를 띄움
        if (event.button === 0) {
            setContextMenu({ x: event.clientX, y: event.clientY });
        }
    };

    // 훅 상태 초기화 함수
    const resetState = () => {
        setContextMenu(null);
        setFkList(null);
        setSelectedFkHash(null);
        setErrorMessage(null);
        setQuestionMessage(null);
        deletedLinkRef.current = null;
        deletedLinksRef.current = [];
    };


    useEffect(() => {
        resetState();;
    }, [selectedDataBase])

    // FK 선택 시 연관 관계 추가 통신 실행
    useEffect(() => {
        if (selectedFkHash) {
            const relationRequest : RelationRequest = {
                dataBaseID: selectedDataBase?.id!,
                parentColumnHash: selectedPkColumnHash,
                childColumnHash: selectedFkHash
            }
            console.log('relationRequest', relationRequest);
            handelFetchRelationAdd(relationRequest);
            resetState(); // 상태 초기화
        }
    }, [selectedFkHash]);

    // 컴포넌트가 마운트되면 `mouseup` 이벤트 리스너 추가
    useEffect(() => {
        resetState();

        window.addEventListener("mouseup", handleMouseUp); // 마우스를 놓을 때 이벤트 발생

        return () => {
            window.removeEventListener("mouseup", handleMouseUp); // 언마운트 시 이벤트 제거
        };
    }, []);

    return {
        hooks: {
            diagramInstanceRef,
            errorMessage,
            setErrorMessage,
            questionMessage,
            setQuestionMessage,
            restoreDeletedLinks,
            handelFetchDeletedLink,
            deletedLinkRef,
            fkList,
            setFkList,
            contextMenu,
        },
        handles: {
            transformTableData,
            validateLink,
            handelFetchRelationAdd,
            getForeignKeys,
            removeLink,
            handleMenuOptionClick,
            handleMenuCancel,
            resetState,
        }
    };
};

