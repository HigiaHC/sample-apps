import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Input } from "../components/input";
import { ListItem } from "../components/list-item";
import { usePopup } from "../contexts/popup";
import { unixToDate } from "../utils/date";

export const Appointment = () => {
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    return (
        <>
            <Header></Header>
            <Wrapper>
                <Center>
                    <Actions>
                        <Input img={require('../assets/search.png').default} placeholder="Search..."></Input>
                        <Button fullWidth={false} onClick={() => navigate('/new')}>Create Resource</Button>
                    </Actions>
                    <List>
                        {references.map(reference =>
                            <ListItem
                                key={reference.id}
                                onClick={() => (loadResource(reference.resourceType, reference.id))}
                                side={`Date: ${unixToDate(reference.date)}`}
                                title={reference.name}
                                subtitle={`Type: ${reference.resourceType}`}></ListItem>
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