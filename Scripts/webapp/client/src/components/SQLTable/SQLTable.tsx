import React, { useEffect, useState } from 'react';
import { Table, TableData, Button, Modal, Divider, Title, Group, Switch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSocket } from '../../contexts/SocketContext';
import { AddPartModal } from '../AddPartModal/AddPartModel';

interface SQLTableProps {
    selectedTable: string;
    fetchUpdate: boolean;
    setFetchUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

function parseTableData(tableName:string, rawTableData:Record<string, any>[]):TableData{
    let parsedTableData:TableData = {
        caption: tableName,
        head: [],
        body: [[]]
      };

    if (rawTableData.length > 0) {
        const firstRow = rawTableData[0];
        const tableColumns = Object.keys(firstRow); // Is this right? could I call firstrow.keys?
        console.log("Table Columns", tableColumns);

        parsedTableData.head = tableColumns;
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
    const [tableColumns, setTableColumns] = useState<string[]>([""]);
    const [suggestedPartID, setSuggestedPartID] = useState<number>(0);

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (isConnected && selectedTable.length !== 0 && fetchUpdate == true){
            console.log("Emitting for table: ", selectedTable);
            
            socket.emit("getTableData", selectedTable, (tableDataResponse: Record<string, any>[]) => {
                // Work on returned data
                const parsedTableData = parseTableData(selectedTable, tableDataResponse);
                setSuggestedPartID(tableDataResponse.length + 1);

                setTableColumns(getTableColumns(tableDataResponse));
                setTableData(parsedTableData);
                setFetchUpdate(false);
            });
        }
    
    }, [selectedTable, fetchUpdate]);
    

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