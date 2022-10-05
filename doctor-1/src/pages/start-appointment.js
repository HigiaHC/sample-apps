import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/button";
import api from "../services/api";

export const StartAppointment = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [requestId, setRequestId] = useState('');
    const [requestKey, setRequestKey] = useState('');
    const [intervalId, setIntervalId] = useState('');

    useEffect(() => {
        let id = window.location.pathname.split('/')[2];
        if (id === '' || id === null || id === undefined) {
            alert('invalid path param');
            navigate('/patients');
        }
        setAddress(id);
        setRequestId(localStorage.getItem(id).split(':')[0]);
        setRequestKey(localStorage.getItem(id).split(':')[1]);

        let interval = setInterval(() => checkAnswer(
            id,
            localStorage.getItem(id).split(':')[0],
            localStorage.getItem(id).split(':')[1],
            interval
        ), 2000);
        setIntervalId(interval);
    }, []);

    const checkAnswer = async (id, reqId, reqKey, interval) => {
        await api.get(`requests/answer/${reqId}`, {
            headers: {
                Authorization: reqKey
            }
        }).then(response => {
            if (response.status === 201) {
                clearInterval(interval);
                if (response.data.token === null) {
                    alert('patient rejected the request');
                    navigate('/patients');
                }
                else {
                    localStorage.setItem(id, `${response.data.id}:${response.data.token}`);
                    navigate(`/appointment/${id}`);
                }
            }
        }).catch(error => {
            if (error.response.status === 401) {
                clearInterval(interval);
                alert('wrong key, please try again.');
                navigate('/patients');
            }
            if (error.response.status === 400) {
                clearInterval(interval);
                alert('wrong key, please try again.');
                navigate('/patients');
            }
        });
    }

    return (
        <Wrapper>
            <Title>
                <Welcome>Appointment start</Welcome>
                <Welcome>Waiting for patient approval</Welcome>
                <Logo src={require('../assets/load.gif').default} width="300px"></Logo>
            </Title>
            <LoginOptions>
                <Option>
                    <Logo src={require('../assets/logo.png').default} width="300px"></Logo>
                </Option>
            </LoginOptions>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    gap: 72px;

    justify-content: center;
    align-items: center;
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`;

const Welcome = styled.h1`
    font-style: italic;
    font-weight: 800;
    font-size: 36px;
    line-height: 42px;
    text-align: right;
    letter-spacing: 0.2em;
`

const Logo = styled.img``

const LoginOptions = styled.div`
    display: flex;
    align-items: center;
    gap: 160px;
`

const Divider = styled.div`
    height: 435px;
    width: 1px;

    background-color: black;
`

const Option = styled.div`
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    gap: 40px;
`

const Icon = styled.img``
