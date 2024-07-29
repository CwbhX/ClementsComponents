import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

import { SocketProvider } from './contexts/SocketContext';



export default function App() {
  return (
    <MantineProvider theme={theme}>
      <SocketProvider>
        <Router />
      </SocketProvider>
    </MantineProvider>
  );
}
