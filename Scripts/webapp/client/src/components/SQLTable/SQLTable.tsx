import React, { useEffect, useState } from 'react';
import { Table, TableData, Button, Modal, Divider, Title, Group, Switch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSocket } from '../../contexts/SocketContext';

interface SQLTableProps {
    selectedTable: string
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


export function SQLTable({ selectedTable }:SQLTableProps) {
    const {socket, isConnected} = useSocket();
    const [tableData, setTableData] = useState<TableData>();
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (isConnected && selectedTable.length !== 0){
            socket.emit("getTableData", selectedTable, (tableDataResponse: Record<string, any>[]) => {
                // Work on returned data
                const parsedTableData = parseTableData(selectedTable, tableDataResponse);
                setTableData(parsedTableData);
              
                // setTableData();
            });
        }
    
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
            <Modal opened={opened} onClose={close} title="Add Part">
                {/* Modal content */}
            </Modal>
        </>
    );
}