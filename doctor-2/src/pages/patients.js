import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Input } from "../components/input";
import { ListItem } from "../components/list-item";
import { usePopup } from "../contexts/popup";

import api from "../services/api";

export const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [reason, setReason] = useState("");
  const { showPopup, handleHide } = usePopup();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    api.get(`patients`)
      .then(response => {
        setPatients(response.data)
      })
  }

  const handleRequest = useCallback(async (id, from) => {
    api.post(`requests/create`, {
      address: id,
      name: from,
      description: 'Appointment'
    }).then(response => {
      localStorage.setItem(id, `${response.data.id}:${response.data.key}`);
    });
    alert('Request sent to patient!');
    navigate(`/start-appointment/${id}`);
  }, [reason])

  const openPopup = useCallback(async (id, from) => {
    showPopup({
      text1: `Request access`,
      onAllow: () => { handleRequest(id, from) },
      onReject: () => handleHide(),
      hasInput: true,
      onChange: (value) => { setReason(value) },
      placeholder: 'Request reason'
    });
  }, [reason]);

  return (
    <>
      <Header></Header>
      <Wrapper>
        <Center>
          <Actions>
            Start appointment
          </Actions>
          <List>
            {patients.map(patient =>
              <ListItem
                key={patient.id}
                title={patient.name}
                subtitle={patient.id}
                onClick={() => handleRequest(patient.id, 'Dr. Cardênio')}></ListItem>
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