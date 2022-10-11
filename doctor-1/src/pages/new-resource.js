import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import styled from "styled-components";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Input } from "../components/input";
import api from "../services/api";
import { dateMask, phoneMask } from "../utils/mask";

export const NewResource = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    type: ""
  })

  const [diagnosticData, setDiagnosticData] = useState({
    subject: "",
    issued: "",
    result: "",
    conclusion: "",
  })

  const [observationData, setObservationData] = useState({
    subject: "",
    issued: "",
    note: "",
    interpretation: "",
    referenceRange: "",
    component: ""
  })

  useEffect(() => {
    let id = window.location.pathname.split('/')[2];
    if (id === '' || id === null || id === undefined) {
      alert('invalid path param');
      navigate('/patients');
    }
    setAddress(id);
    setToken(localStorage.getItem(id).split(':')[1]);
  }, []);

  const handleSubmit = async () => {

    if (formData.name === "") {
      alert('Field cannot be empty');
      return;
    }

    switch (formData.type.toLowerCase()) {
      case 'observation':
        api.post(`resources`, {
          patient: address,
          description: formData.name,
          type: formData.type,
          fields: observationData,
          from: 'Dr. Ricardo'
        }).then(response => {
          alert('Resource request was sent to the patient!');
          navigate(`/appointment/${address}`);
        }).catch(error => {
          alert('Something went wrong, try again');
          navigate(`/appointment/${address}`);
        });
        break;

      case 'diagnostic':
        console.log(`dfasdfasdf`);
        api.post(`resources`, {
          patient: address,
          description: formData.name,
          type: formData.type,
          fields: diagnosticData,
          from: 'Dr. Ricardo'
        }).then(response => {
          alert('Resource request was sent to the patient!');
          navigate(`/appointment/${address}`);
        }).catch(error => {
          alert('Something went wrong, try again');
          navigate(`/appointment/${address}`);
        });
        break;

      default:
        alert('resource type not defined');
        break;
    }
  }
  return (
    <>
      <Header name={name}></Header>
      <Wrapper>
        <Center>
          <Actions>
            <Button fullWidth={false} onClick={() => navigate(`/appointment/${address}`)}>Back to appointment</Button>
          </Actions>
          <Input placeholder="Resource Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e }))}></Input>
          <StyledSelect placeholder="Select Resource type..." options={[
            { value: 'Diagnostic', label: 'Diagnostic Report' },
            { value: 'Observation', label: 'Observation' }
          ]} onChange={({ value }) => setFormData(prev => ({ ...prev, type: value }))} />
          <hr></hr>
          {formData.type === 'Diagnostic' && <>
            <Input placeholder="Subject" value={diagnosticData.subject} onChange={(e) => setDiagnosticData(prev => ({ ...prev, subject: e }))}></Input>
            <Input placeholder="Issued" value={diagnosticData.issued} onChange={(e) => setDiagnosticData(prev => ({ ...prev, issued: e }))} mask={dateMask}></Input>
            <Input placeholder="Result" value={diagnosticData.result} onChange={(e) => setDiagnosticData(prev => ({ ...prev, result: e }))}></Input>
            <Input placeholder="Conclusion" value={diagnosticData.conclusion} onChange={(e) => setDiagnosticData(prev => ({ ...prev, conclusion: e }))}></Input>
          </>}
          {formData.type === 'Observation' && <>
            <Input placeholder="Subject" value={observationData.subject} onChange={(e) => setObservationData(prev => ({ ...prev, subject: e }))}></Input>
            <Input placeholder="Issued" value={observationData.issued} onChange={(e) => setObservationData(prev => ({ ...prev, issued: e }))} mask={dateMask}></Input>
            <Input placeholder="Note" value={observationData.note} onChange={(e) => setObservationData(prev => ({ ...prev, note: e }))}></Input>
            <Input placeholder="Interpretation" value={observationData.interpretation} onChange={(e) => setObservationData(prev => ({ ...prev, interpretation: e }))}></Input>
            <Input placeholder="Reference Range" value={observationData.referenceRange} onChange={(e) => setObservationData(prev => ({ ...prev, referenceRange: e }))}></Input>
            <Input placeholder="Component" value={observationData.component} onChange={(e) => setObservationData(prev => ({ ...prev, component: e }))}></Input>
          </>}
          <ButtonWrapper>
            <Button onClick={async () => handleSubmit()} fullWidth={false}>Create Resource</Button>
          </ButtonWrapper>
        </Center>
      </Wrapper>
    </>
  )
}

const StyledSelect = styled(Select)`
  width: 400px;
  height: 32px;


  color: #000000;
  font-weight: 400;
`

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 200px;
`

const Center = styled.div`
  width: 968px;

  display: flex;
  flex-direction: column;
  gap: 32px;
`

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const Actions = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 24px;
`