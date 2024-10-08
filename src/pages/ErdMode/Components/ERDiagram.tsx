import React, {useEffect, useRef, useState} from 'react';
import styles from '../ErdMode.module.scss';
import * as go from 'gojs';
import { useTable } from '../../../contexts/TableContext';
import {findColumnInfo} from "../../../utils/utils";
import {useDataBase} from "../../../contexts/DataBaseContext";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {tableRelationConnect, workSpaceBuildDataSave} from "../../../services/api";

const ERDiagram: React.FC = () => {
    const { selectedDataBase } = useDataBase();
    const { tables, setTables, selectedTable, setSelectedTable } = useTable();
    const diagramRef = useRef<HTMLDivElement | null>(null);
    const diagramInstanceRef = useRef<go.Diagram | null>(null);
    const deletedLinksRef = useRef<any[]>([]); // 삭제된 링크를 저장할 참조

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    useEffect(() => {
        const $ = go.GraphObject.make;

        const initDiagram = () => {
            const diagram = $(go.Diagram, diagramRef.current as HTMLDivElement, {
                initialAutoScale: go.Diagram.Uniform,
                layout: $(go.LayeredDigraphLayout),
                allowCopy: false, // 복사 비활성화
                allowDelete: false, // 삭제 비활성화
                'undoManager.isEnabled': false, // Undo/Redo 기능 활성화
                'linkingTool.isEnabled': false, // 링크 기능 비활성화 (기본값)
                'relinkingTool.isEnabled': false, // 재연결 비활성화
            });

            // 노드 템플릿 정의
            diagram.nodeTemplate = $(
                go.Node,
                'Auto',
                $(go.Shape, 'RoundedRectangle', {
                    strokeWidth: 1,
                    fill: 'white',
                    stroke: '#bdbdbd',
                }),
                $(
                    go.Panel,
                    'Table',
                    {
                        defaultRowSeparatorStroke: '#00A3FF',
                        padding: 10,
                    },
                    $(go.TextBlock, {
                        row: 0,
                        columnSpan: 4,
                        margin: 10,
                        alignment: go.Spot.Left,
                        font: '11pt KoPubWorld Bold',
                        stroke: '#595959',
                    }, new go.Binding('text', 'name')),
                    $(go.Panel, 'Vertical', {
                        row: 1,
                        columnSpan: 4,
                        margin: new go.Margin(10, 15, 10, 15),
                        alignment: go.Spot.Center,
                    }, new go.Binding('itemArray', 'columns'), {
                        itemTemplate: $(
                            go.Panel,
                            'Horizontal',
                            $(go.TextBlock, {
                                margin: new go.Margin(5, 10, 5, 10),
                                font: '10pt KoPubWorld Medium',
                                stroke: '#000000',
                                width: 35,
                                alignment: go.Spot.Center,
                            }, new go.Binding('text', 'keyName')),
                            $(go.TextBlock, {
                                margin: new go.Margin(5, 10, 5, 10),
                                font: '10pt KoPubWorld Medium',
                                stroke: '#000000',
                                width: 120,
                                alignment: go.Spot.Left,
                            }, new go.Binding('text', 'name')),
                            $(go.TextBlock, {
                                margin: new go.Margin(5, 10, 5, 10),
                                font: '10pt KoPubWorld Medium',
                                stroke: '#000000',
                                width: 80,
                                alignment: go.Spot.Left,
                            }, new go.Binding('text', 'type')),
                            $(go.TextBlock, {
                                margin: new go.Margin(5, 10, 5, 10),
                                font: '9pt KoPubWorld Medium',
                                stroke: 'gray',
                                width: 70,
                                alignment: go.Spot.Left,
                            }, new go.Binding('text', 'nullLabel', (nullable) => (nullable ? 'NOT NULL' : 'NULL')))
                        )
                    })
                ),
                {
                    fromLinkable: true,
                    toLinkable: true,
                    cursor: 'pointer',
                }
            );

            diagram.linkTemplate = $(
                go.Link,
                { routing: go.Link.Orthogonal, corner: 5 },
                $(go.Shape), // 선 그리기
                $(go.TextBlock, {
                    textAlign: 'center',
                    font: '10pt sans-serif',
                    segmentIndex: 0,
                    segmentOrientation: go.Link.OrientUpright,
                    segmentOffset: new go.Point(10, -10),
                }, new go.Binding('text', 'from', (from) => (from ? '1' : ''))),
                $(go.TextBlock, {
                    textAlign: 'center',
                    font: '10pt sans-serif',
                    segmentIndex: -1,
                    segmentOrientation: go.Link.OrientUpright,
                    segmentOffset: new go.Point(-8, -10),
                }, new go.Binding('text', 'to', (to) => (to ? 'N' : '')))
            );

            // 선 연결
            diagram.addDiagramListener('LinkDrawn', (e) => {
                const link = e.subject;
                const parentKey = link.data.from;
                const childKey = link.data.to;

                let isValidLink = false;

                const parentTable = tables.find(table => table.id === parentKey);
                const childTable = tables.find(table => table.id === childKey);

                if (!parentTable || !childTable) return;

                const isValidLinkMessage = validateLink(parentTable, childTable); // 유효성 검사 로직
                if (!isValidLinkMessage) {
                    isValidLink = true;  // 유효성 검사가 통과되었을 경우 링크를 허용
                } else {
                    setErrorMessage(isValidLinkMessage);  // 유효하지 않을 경우 오류 메시지를 표시
                }

                if (!isValidLink) { // 유효하지 않은 링크를 삭제
                    const model = diagram.model as go.GraphLinksModel;
                    model.removeLinkData(link.data);
                } else { // 유효할 경우 통신
                   const relationRequest : RelationRequest = {
                       dataBaseID: selectedDataBase?.id!,
                       parentTableHash: parentTable.tableHash,
                       childTableHash: childTable.tableHash
                   }
                   console.log('relationRequest', relationRequest);
                   handelFetchRelationAdd(relationRequest);
                }
            });

            // 노드, 선 삭제 로직 (선 삭제 로직 추가 시 작업 예정)
            // diagram.addDiagramListener('SelectionDeleted', (e) => {
            //     let nodeDeleted = false; // 노드가 삭제되었는지 여부를 추적
            //
            //     e.subject.each((part: go.Part) => {
            //         if (part instanceof go.Node) {
            //             nodeDeleted = true;
            //             // diagram.model.addNodeData(part.data); // 노드 다시 추가
            //             setQuestionMessage("해당 테이블을 삭제 하시겠습니까?");
            //             return;
            //         } else if (part instanceof go.Link) {
            //             const linkData = part.data;
            //             if (!deletedLinksRef.current) {
            //                 deletedLinksRef.current = [];
            //             }
            //             deletedLinksRef.current.push(linkData);
            //             if (!nodeDeleted) { // 노드가 삭제되지 않았다면 링크 처리
            //                 setQuestionMessage("해당 선을 삭제 하시겠습니까?");
            //             }
            //         }
            //     });
            // });

            // 키보드 이벤트 핸들러 정의
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.ctrlKey) {
                    diagram.toolManager.linkingTool.isEnabled = true;
                    diagram.toolManager.draggingTool.isEnabled = false;
                }
            };

            const handleKeyUp = (e: KeyboardEvent) => {
                if (!e.ctrlKey) {
                    diagram.toolManager.linkingTool.isEnabled = false;
                    diagram.toolManager.draggingTool.isEnabled = true;
                }
            };

            // 키보드 이벤트 리스너 추가
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);

            const transformedData = transformTableData(tables);
            diagram.model = new go.GraphLinksModel(transformedData.node, transformedData.linkData);

            diagram.addDiagramListener('ChangedSelection', (e) => {
                const selectedNode = diagram.selection.first();
                if (selectedNode) {
                    const selectTable = tables.find((table) => table.id === selectedNode.data.key);
                    setSelectedTable(selectTable ? selectTable : null);
                } else {
                    setSelectedTable(null);
                }
            });

            return diagram;
        };

        const diagramInstance = initDiagram();
        diagramInstanceRef.current = diagramInstance;

        return () => {
            if (diagramInstanceRef.current) {
                diagramInstanceRef.current.div = null;
            }
        };
    }, [tables]);

    useEffect(() => {
        if (diagramInstanceRef.current && selectedTable) {
            const nodeKey = selectedTable.id;
            const diagram = diagramInstanceRef.current;
            diagram.select(diagram.findNodeForKey(nodeKey));
        }
    }, [selectedTable, tables]);

    // 관계 연결 유효성 검사
    const validateLink = (parentTable: TableData, childTable: TableData): string | null => {
        const isParentTableValid = Object.entries(parentTable.tableInnerStructure).some(([columnMeta, columnData]) => {
            const columnInfo = findColumnInfo(columnMeta);
            return columnInfo.isPk;  // 부모 테이블에 PK가 있는지 확인
        });

        const isChildTableValid = Object.entries(childTable.tableInnerStructure).some(([columnMeta, columnData]) => {
            const columnInfo = findColumnInfo(columnMeta);
            return columnInfo.isFk;  // 자식 테이블에 FK가 있는지 확인
        });

        if (!isParentTableValid) return "부모 테이블에 PK가 존재하지 않습니다.";
        if (!isChildTableValid) return "자식 테이블에 FK가 존재하지 않습니다.";

        return null;
    };

    // 관계 선 추가 통신
    const handelFetchRelationAdd = async (relationRequest: RelationRequest) => {
        try {
            const response = await tableRelationConnect(relationRequest);
            console.log('response', response)
            // setTables(response);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생 하였습니다.'
            setErrorMessage(error)
        }
    }

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

    return (
        <>
            <div ref={diagramRef} className={styles.ERDiagram} />

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }

            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onCloseConfirm={() => {
                    restoreDeletedLinks();
                }}
                onConfirm={() => {
                    handelFetchDeletedLink();
                }}
            /> }
        </>
    );
};

export default ERDiagram;


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
