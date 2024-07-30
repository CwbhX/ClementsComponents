import React, { useState } from 'react';
import { AppShell, Burger, Group, Skeleton, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SQLTable } from '../components/SQLTable/SQLTable';
import { SQLTables } from '@/components/SQLTables/SQLTables';


export function HomePage() {
    const [opened, { toggle }] = useDisclosure();
    const [selectedTable, setSelectedTable] = useState<string>("");
    // let selectedTable:string = ""; // Why doesn't this work?


    const handleTableSelect = (tableName: string) => {
        // selectedTable = tableName;
        setSelectedTable(tableName);
        console.log(`Selected Table: ${selectedTable}`);
    };

    // Main JSX
    return (
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        // aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
        padding="md"
      >
        <AppShell.Header>
          <Title>ClementsComponents</Title>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <SQLTables onTableSelect={handleTableSelect}></SQLTables>
        </AppShell.Navbar>
        <AppShell.Main>
            <SQLTable selectedTable={selectedTable}></SQLTable>
        </AppShell.Main>
        {/* <AppShell.Aside p="md">Aside</AppShell.Aside>
        <AppShell.Footer p="md">Footer</AppShell.Footer> */}
      </AppShell>
    );
}