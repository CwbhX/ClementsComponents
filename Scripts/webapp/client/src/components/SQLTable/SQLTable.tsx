import React, { useEffect, useState } from 'react';
import { Table, TableData, Button, Modal, Divider, Title, Group, Switch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSocket } from '../../contexts/SocketContext';
import { AddPartModal } from '../AddPartModal/AddPartModel';
import { timeStamp } from 'console';

interface SQLTableProps {
    selectedTable: string;
    fetchUpdate: boolean;
    setFetchUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

type TableInfo = {
    field: string;
    type: string;
    isNull: boolean;
    defaultValue: null | string;
    extra: string
};

function isNullOrEmpty(value:any) {
    return (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
    );
}

function parseTableData(existingTableData:TableData | undefined, tableName:string, rawTableData:Record<string, any>[]):TableData{
    let parsedTableData:TableData = {
        caption: tableName,
        head: [],
        body: [[]]
      };

    if (rawTableData.length > 0) {
        const firstRow = rawTableData[0];
        const tableColumns = Object.keys(firstRow); // Is this right? could I call firstrow.keys?
        console.log("Table Columns", tableColumns);

        if (existingTableData === undefined){
            console.log("Table Data was undefined, setting to: ", tableColumns);
            
            parsedTableData.head = tableColumns;
        } else {
            console.log("Table Data already existed, setting to: ", existingTableData.head);
            parsedTableData.head = existingTableData.head;
        }
        
        parsedTableData.body = rawTableData.map(Object.values);
    }

    return parsedTableData;
}

function getTableColumns(rawTableData:Record<string, any>[]):string[]{
    let columns = [""];

    if (rawTableData.length > 0) {
        const firstRow = rawTableData[0];
        columns = Object.keys(firstRow);
    }

    return columns;
}


export function SQLTable({ selectedTable, fetchUpdate, setFetchUpdate }:SQLTableProps) {
    const {socket, isConnected} = useSocket();
    const [tableData, setTableData] = useState<TableData>();
    const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);
    const [tableColumns, setTableColumns] = useState<string[]>([""]);
    const [suggestedPartID, setSuggestedPartID] = useState<number>(0);

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (isConnected && selectedTable.length !== 0 && fetchUpdate == true){
            console.log("Emitting for table: ", selectedTable);
            
            socket.emit("getTableData", selectedTable, (tableDataResponse: Record<string, any>[]) => {
                // Work on returned data
                const parsedTableData = parseTableData(tableData, selectedTable, tableDataResponse);
                setSuggestedPartID(tableDataResponse.length + 1);

                setTableColumns(getTableColumns(tableDataResponse));
                setTableData(parsedTableData);
                setFetchUpdate(false);
            });
        }
    
    }, [selectedTable, fetchUpdate]);

    useEffect(() => {
        socket.emit('getTableInfo', selectedTable, (tableInfoResponse: TableInfo[]) => {
            setTableInfo(tableInfoResponse);
            const noTableData = tableData === undefined;

            if(noTableData || isNullOrEmpty(tableData.head)){
                setTableData(prevTableData => {
                    console.log("Previous Table Data is: ", prevTableData);
                    console.log("Current selected Table is: ", selectedTable);
                    
                    
                    const columns = tableInfoResponse.reduce((acc:string[], currentValue:TableInfo) => {
                        acc.push(currentValue.field);
                        return acc;
                    }, []);

                    if (noTableData === undefined){
                        console.log("No table data yet. Will add: ", columns);
                        
                        const tempTableData:TableData = {
                            caption: selectedTable,
                            head: columns,
                            body: [[]]
                        }

                        return tempTableData;
                    } else {
                        console.log("Previous data: ", prevTableData);
                        
                        return({
                            ...prevTableData,
                            head: columns
                        })
                    }
                });
            }
        });
    }, [selectedTable]);
    

    return (
        <>
            <Group justify='space-between'>
                <Title order={1}>{selectedTable}</Title>
                <Group justify='center'>
                    <Switch
                    label="Edit Mode"
                    />
                    <Button>Edit Table</Button>
                    <Button onClick={open}>Add Part</Button>
                </Group>
            </Group>
            <Divider my="sm" />
            <Table.ScrollContainer minWidth={500}>
                <Table highlightOnHover withColumnBorders data={tableData}/>
            </Table.ScrollContainer>

            <AddPartModal 
                tableName={selectedTable}
                modalState={opened} 
                modalClose={close}
                modalFields={tableColumns}
                partIndex={suggestedPartID}
                setFetchUpdate={setFetchUpdate}
                />
        </>
    );
}