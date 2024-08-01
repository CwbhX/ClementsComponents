import React, { useEffect, useState, FC } from "react";
import { Modal, Stack, Group, Text, TextInput, Button } from '@mantine/core';

interface AddPartModalProps {
    modalState: boolean;
    modalClose: () => void;
    modalFields: string[];
    partIndex: number;
}

function textInputConditional(field:string, suggestedID:number):React.ReactElement{
    if(field === "id"){
        return(        
            <TextInput
            disabled
            label={"Part #"}
            placeholder={suggestedID.toString()}
            />
        )
    } else {
        return(
            <TextInput
            label={field}
            placeholder={field}
            />
        )
    }
}


export function AddPartModal( {modalState, modalClose, modalFields, partIndex}:AddPartModalProps ) {
    console.log("fields: ", modalFields);
    

    return (
        <Modal opened={modalState}
                onClose={modalClose} 
                title="Add a Part" 
                centered
                overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
                }}>
        
            <Stack>
                {modalFields.map((tableField) => (
                    <Stack key={tableField}>
                        {textInputConditional(tableField, partIndex)}
                    </Stack>
                ))}

                <Group justify="flex-end">
                    <Button variant="filled">Save</Button>
                </Group>
            </Stack>
        </Modal>
    );
}