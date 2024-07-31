import React, { useEffect, useState, FC } from "react";
import { Modal, Stack, Group, Text, TextInput, Button } from '@mantine/core';

interface AddPartModalProps {
    modalState: boolean;
    modalClose: () => void;
    modalFields: string[];
    partIndex: number;
}


export function AddPartModal( {modalState, modalClose, modalFields, partIndex}:AddPartModalProps ) {
    

    return (
        <Modal opened={modalState}
                onClose={modalClose} 
                title="Add a Part" 
                centered
                overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
                }}>
        
            {modalFields.map((tableField) => (
                <Stack>
                    <TextInput
                    label={tableField}
                    placeholder={tableField}
                    />
                </Stack>
            ))}

            <Group justify="flex-end">
                <Button variant="filled">Save</Button>;
            </Group>
        
        </Modal>
    );
}