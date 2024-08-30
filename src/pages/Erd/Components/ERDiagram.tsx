import React, { useEffect, useRef } from 'react';
import styles from '../Erd.module.scss';
import * as go from 'gojs';
import { findColumnInfo } from '../../../utils/utils';
import { useTable } from '../../../contexts/TableContext';

const ERDiagram: React.FC = () => {
    const { tables } = useTable();
    const diagramRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const $ = go.GraphObject.make;

        const initDiagram = () => {
            const diagram = $(go.Diagram, diagramRef.current as HTMLDivElement, {
                initialAutoScale: go.Diagram.Uniform,
                layout: $(go.LayeredDigraphLayout),
            });

            diagram.nodeTemplate = $(
                go.Node,
                'Auto',
                $(
                    go.Shape,
                    'RoundedRectangle',
                    {
                        strokeWidth: 1,
                        fill: 'white',
                        stroke: '#bdbdbd'
                    }
                ),
                $(
                    go.Panel,
                    'Table',
                    {
                        defaultRowSeparatorStroke: '#00A3FF',
                        padding: 10
                    },
                    $(
                        go.TextBlock,
                        {
                            row: 0,
                            columnSpan: 4,
                            margin: 10,
                            alignment: go.Spot.Left,
                            font: '11pt KoPubWorld Bold',
                            stroke: '#595959',
                        },
                        new go.Binding('text', 'name')
                    ),
                    $(
                        go.Panel,
                        'Vertical',
                        {
                            row: 1,
                            columnSpan: 4,
                            margin: new go.Margin(10, 15, 10, 15),
                            alignment: go.Spot.Center
                        },
                        new go.Binding('itemArray', 'columns'),
                        {
                            itemTemplate: $(
                                go.Panel,
                                'Horizontal',
                                {
                                    defaultColumnSeparatorStroke: 'gray',
                                },
                                $(
                                    go.TextBlock,
                                    {
                                        margin: new go.Margin(5, 10, 5, 10),
                                        font: '10pt KoPubWorld Medium',
                                        stroke: '#000000',
                                        width: 35,
                                        alignment: go.Spot.Center
                                    },
                                    new go.Binding('text', 'keyName'),
                                ),
                                $(
                                    go.TextBlock,
                                    {
                                        margin: new go.Margin(5, 10, 5, 10),
                                        font: '10pt KoPubWorld Medium',
                                        stroke: '#000000',
                                        width: 120,
                                        alignment: go.Spot.Left
                                    },
                                    new go.Binding('text', 'name')
                                ),
                                $(
                                    go.TextBlock,
                                    {
                                        margin: new go.Margin(5, 10, 5, 10),
                                        font: '10pt KoPubWorld Medium',
                                        stroke: '#000000',
                                        width: 80,
                                        alignment: go.Spot.Left
                                    },
                                    new go.Binding('text', 'type')
                                ),
                                $(
                                    go.TextBlock,
                                    {
                                        margin: new go.Margin(5, 10, 5, 10),
                                        font: '9pt KoPubWorld Medium',
                                        stroke: 'gray',
                                        width: 70,
                                        alignment: go.Spot.Left
                                    },
                                    new go.Binding('text', 'nullLabel', (nullable) => (nullable ? 'NULL' : 'NOT NULL'))
                                )
                            )
                        }
                    )
                )
            );

            diagram.linkTemplate = $(
                go.Link,
                {
                    routing: go.Link.Orthogonal,
                    corner: 5,
                },
                $(go.Shape), // 선을 그립니다.
                $(go.TextBlock,
                    {
                        textAlign: "center",
                        font: "10pt sans-serif",
                        segmentIndex: 0, // 시작 부분에 배치
                        segmentOrientation: go.Link.OrientUpright,
                        segmentOffset: new go.Point(10, -10),
                    },
                    new go.Binding("text", "from", (from) => (from ? '1' : ''))
                ),
                $(go.TextBlock,
                    {
                        textAlign: "center",
                        font: "10pt sans-serif",
                        segmentIndex: -1, // 끝 부분에 배치
                        segmentOrientation: go.Link.OrientUpright,
                        segmentOffset: new go.Point(-8, -10),
                    },
                    new go.Binding("text", "to", (to) => (to ? 'N' : ''))
                )
            );

            // 데이터 변환
            const transformedData = transformTableData(tables);
            diagram.model = new go.GraphLinksModel(transformedData.node, transformedData.linkData);

            return diagram;
        };

        let diagramInstance = initDiagram();

        return () => {
            if (diagramInstance) {
                diagramInstance.div = null;
            }
        };
    }, [tables]);

    return <div ref={diagramRef} className={styles.ERDiagram} />;
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


