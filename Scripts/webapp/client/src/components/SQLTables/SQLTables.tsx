import React, { useEffect, useState, FC } from "react";
import { Table, Title, Divider } from '@mantine/core';
import { useSocket } from "@/contexts/SocketContext";

interface SQLTablesProps {
    onTableSelect: (tableName: string) => void;
}

export function SQLTables({ onTableSelect }:SQLTablesProps){
    const {socket, isConnected} = useSocket(); // Reference socket provider for socket.io
    const [tables, setTables] = useState<string[]>([]);

    useEffect(() => {
        if (isConnected) { // If connected, socket is not null too
            socket.emit('getTables', (tablesResponse: string[]) => {
                setTables(tablesResponse);
            });
        }
    }, [isConnected])
    
    // Display DB Table names and pass selectedname up to parent component
    return (
        <>
            <Title order={3}>Tables</Title>
            <Table highlightOnHover>
                <Table.Tbody>
                    {tables.map((tableName) => (
                        <Table.Tr key={tableName} onClick={() => onTableSelect(tableName)}>
                            <Table.Td>{tableName}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    );
}