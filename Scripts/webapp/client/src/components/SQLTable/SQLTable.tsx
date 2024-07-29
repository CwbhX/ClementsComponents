import React, { useEffect, useState } from 'react';
import { Table, TableData } from '@mantine/core';
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
      <Table highlightOnHover data={tableData}/>
    );
}