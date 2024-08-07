import React, { useEffect, useState, FC } from "react";
import { Modal, Stack, Group, Text, TextInput, Button } from '@mantine/core';
import { useSocket } from "@/contexts/SocketContext";

interface AddPartModalProps {
    tableName: string;
    modalState: boolean;
    modalClose: () => void;
    modalFields: string[];
    partIndex: number;
    setFetchUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

type InputChangeHandler = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;

function textInputCon(field:string, valueState:string, onChangeHandler:InputChangeHandler, suggestedID:number):React.ReactElement{
    if(field === "id"){
        return(        
            <TextInput
            disabled
            label={"Part #"}
            placeholder={suggestedID.toString()}
            value={suggestedID.toString()}
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


export function AddPartModal( {tableName, modalState, modalClose, modalFields, partIndex, setFetchUpdate}:AddPartModalProps ) {
    const {socket, isConnected} = useSocket(); // Reference socket provider for socket.io

    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    let fieldsSetup = false; // Initial state to false to let us update the fields once once SQL returns data

    useEffect(() => {
        if (modalFields.length > 0 && fieldsSetup == false){
            const initialFieldValues = modalFields.reduce((acc, field) => {
                if (field === "id") {
                    acc[field] = partIndex.toString(); // Set ID to the recommended field since it won't get updated properly later since we can't type into it
                } else {
                    acc[field] = "";
                };
                
                return acc;
            }, {} as Record<string, string>);

            setInputValues(initialFieldValues);
            fieldsSetup = true;
            console.log("Setup initial values");
        }
    }, [modalFields]);
    
    // Higher level function for each field's event handler
    const handleInputChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues((previousValues) => ({
            ...previousValues,
            [fieldName]: event.target.value
        }));
    };

      // Handle save button click
    const handleSave = () => {
        console.log("Input Values: ", inputValues);
        
        if (isConnected){
            socket.emit('insertRow', {tableName:tableName, rowData:inputValues}, (affectedRow:number) => {
                console.log("Successful added row: ", affectedRow);
                if(affectedRow != null){
                    modalClose();
                    setFetchUpdate(true);
                }
            });
        }
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