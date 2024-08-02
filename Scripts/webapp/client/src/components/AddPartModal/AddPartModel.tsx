import React, { useEffect, useState, FC } from "react";
import { Modal, Stack, Group, Text, TextInput, Button } from '@mantine/core';

interface AddPartModalProps {
    modalState: boolean;
    modalClose: () => void;
    modalFields: string[];
    partIndex: number;
}

type InputChangeHandler = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;

function textInputCon(field:string, valueState:string, onChangeHandler:InputChangeHandler, suggestedID:number):React.ReactElement{
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
            value={valueState}
            onChange={onChangeHandler(field)}
            />
        )
    }
}


export function AddPartModal( {modalState, modalClose, modalFields, partIndex}:AddPartModalProps ) {
    console.log("fields: ", modalFields);
    // Create a state for tracking field inputs, initialise with reduce to a dict with "" as default values
    const [inputValues, setInputValues] = useState<Record<string, string>>(
        modalFields.reduce((acc, field) => {
            acc[field] = "";
            return acc;
        }, {} as Record<string, string>)
    );

    const handleInputChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues((previousValues) => ({
            ...previousValues,
            [fieldName]: event.target.value
        }));
    };

      // Handle save button click
    const handleSave = () => {
        console.log("Input Values: ", inputValues);
        // Additional processing can be done here
    };

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
                        {textInputCon(tableField, inputValues[tableField], handleInputChange, partIndex)}
                    </Stack>
                ))}

                <Group justify="flex-end">
                    <Button variant="filled" onClick={handleSave}>Save</Button>
                </Group>
            </Stack>
        </Modal>
    );
}