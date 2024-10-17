import React, {useEffect, useRef} from 'react';
import styles from '../ErdMode.module.scss';
import * as go from 'gojs';
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {useERDiagram} from "../hooks/useERDiagram";
import {useTable} from "../../../contexts/TableContext";


const ERDiagram: React.FC = () => {
    const { tables, selectedTable, setSelectedTable } = useTable();

    const {
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
    } = useERDiagram();

    const diagramRef = useRef<HTMLDivElement | null>(null);
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
            deletedLinkRef.current = link.data;

            let isValidLink = false;

            const parentTable = tables.find(table => table.id === parentKey);
            const childTable = tables.find(table => table.id === childKey);

            if (!parentTable || !childTable) return;

            const isValidLinkMessage = validateLink(parentTable, childTable); // 유효성 검사 로직
            if (!isValidLinkMessage) {
                isValidLink = true;  // 유효성 검사가 통과 되었을 경우 링크를 허용
            } else {
                setErrorMessage(isValidLinkMessage);  // 유효하지 않을 경우 오류 메시지를 표시
            }

            if (!isValidLink) { // 유효하지 않은 링크를 삭제
                removeLink(deletedLinkRef.current); // 삭제 함수 호출
            } else { // 유효할 경우 통신
                const childFkList = getForeignKeys(childTable);
                setFkList(childFkList);
            }
        });

        // 노드, 선 삭제 로직 (선 삭제 로직 추가 시 작업 예정)
        // diagram.addDiagramListener('SelectionDeleted', (e) => {
        //     let nodeDeleted = false; // 노드가 삭제 되었는지 여부를 추적
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
    }; // initDiagram 함수


    // ERD 업데이트
    useEffect(() => {
        diagramInstanceRef.current = initDiagram();

        return () => {
            if (diagramInstanceRef.current) {
                diagramInstanceRef.current.div = null;
            }
        };
    }, [tables]);

    // 테이블 선택 시 업데이트
    useEffect(() => {
        if (diagramInstanceRef.current && selectedTable) {
            const nodeKey = selectedTable.id;
            const diagram = diagramInstanceRef.current;
            diagram.select(diagram.findNodeForKey(nodeKey));
        }
    }, [selectedTable, tables]);


    return (
        <>
            <div ref={diagramRef} className={styles.ERDiagram} />

            {/* 컨텍스트 메뉴 */}
            {contextMenu && fkList && (
                <div
                    className={styles.contextMenu}
                    style={{ top: contextMenu.y - 130, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <p>연결할 FK 선택 <span>{'>'}</span></p>
                    <ul>
                        {fkList.map((fk, index) =>
                            <li key={index} onClick={() => handleMenuOptionClick(fk.hash)}>{fk.name}</li>
                        )}
                        <li onClick={handleMenuCancel} style={{color: 'red', fontWeight: 'normal'}}>Cancel</li>
                    </ul>
                </div>
            )}

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
