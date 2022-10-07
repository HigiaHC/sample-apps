import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Input } from "../components/input";
import { ListItem } from "../components/list-item";
import { usePopup } from "../contexts/popup";
import api from "../services/api";
import { unixToDate } from "../utils/date";

export const Appointment = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [requestId, setRequestId] = useState('');
    const [requestToken, setRequestToken] = useState('');
    const [references, setReferences] = useState([]);

    useEffect(() => {
        let id = window.location.pathname.split('/')[2];
        if (id === '' || id === null || id === undefined) {
            alert('invalid path param');
            navigate('/patients');
        }
        setAddress(id);
        setRequestId(localStorage.getItem(id).split(':')[0]);
        setRequestToken(localStorage.getItem(id).split(':')[1]);

        getPatientResources(
            id,
            localStorage.getItem(id).split(':')[1]
        );
    }, []);

    const getPatientResources = async (id, token) => {
        await api.get(`resources/${id}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            console.log(response);
            setReferences(response.data);
        })
    }

    const finishAppointment = async () => {
        localStorage.removeItem(address);
        navigate('/patients');
    }

    return (
        <>
            <Header></Header>
            <Wrapper>
                <Center>
                    <Actions>
                        <Button fullWidth={false} onClick={() => finishAppointment()}>Finish Appointment</Button>
                        <Button fullWidth={false} onClick={() => navigate(`/new/${address}`)}>Create Resource</Button>
                    </Actions>
                    <List>
                        {references.map(reference =>
                            <ListItem
                                key={reference.id}
                                onClick={() => (navigate(`/resource/${address}/${reference.type}/${reference.id}`))}
                                side={`Date: ${reference.date}`}
                                title={reference.description}
                                subtitle={`Type: ${reference.type}`}></ListItem>
                        )}
                    </List>
                </Center>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: 200px;
`

const Center = styled.div`
    width: 968px;
`

const Actions = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 24px;
`

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding-bottom: 40px;
`