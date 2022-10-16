import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from 'react-select';
import styled from "styled-components";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Input } from "../components/input";
import api from "../services/api";
import { dateMask, phoneMask } from "../utils/mask";

export const NewResource = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    type: ""
  })

  const [diagnosticData, setDiagnosticData] = useState({
    code: {
      text: ""
    },
    subject: "",
    issued: "",
    result: "",
    conclusion: "",
  })

  const [observationData, setObservationData] = useState({
    code: {
      text: ""
    },
    performer: {
      display: ""
    },
    subject: {
      reference: ""
    },
    issued: "",
    note: [{text: ""}],
    interpretation: {
      text: ""
    },
  })

  const [medicationData, setMedicationData] = useState({
    medication: {
      concept: {
        coding: {
          display: ""
        }
      }
    },
    requester: {
      display: ""
    },
    subject: {
      reference: ""
    },
    issued: "",
    intent: "order",
    note: "",
    dosageInstruction: "",
    dispenserequest: {
      validityPeriod: {
        start: "",
        end: ""
      }
    },
    quantity: {
      value: ""
    }
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
        observationData.subject.reference = `Patient/${location.state.patientId}`;
        observationData.issued = new Date().toISOString().slice(0, 18);
        observationData.performer.display = 'Dr. Ricardo';

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
      case'diagnosticreport':
        diagnosticData.subject = `Patient/${location.state.patientId}`;
        diagnosticData.issued = new Date().toISOString().slice(0, 18);
        diagnosticData.performer.display = 'Dr. Ricardo';

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
      case'diagnosticreport':
        medicationData.subject = location.state.patientId;
        medicationData.issued = new Date().toISOString().slice(0, 18);
        medicationData.requester.display = 'Dr. Ricardo';

        api.post(`resources`, {
          patient: address,
          description: formData.name,
          type: formData.type,
          fields: medicationData,
          from: 'Dr. Ricardo'
        }).then(response => {
          alert('Resource request was sent to the patient!');
          navigate(`/appointment/${address}`);
        }).catch(error => {
          alert('Something went wrong, try again');
          navigate(`/appointment/${address}`);
        });
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
            { value: 'DiagnosticReport', label: 'Diagnostic Report' },
            { value: 'Observation', label: 'Observation' },
            { value: 'MedicationRequest', label: 'Medication Request' }
          ]} onChange={({ value }) => setFormData(prev => ({ ...prev, type: value }))} />
          <hr></hr>
          {formData.type === 'DiagnosticReport' && <>
            <Input placeholder="Procedure" value={diagnosticData.code.text} onChange={(e) => setDiagnosticData(prev => ({ ...prev, code: { text: e } }))}></Input>
            <Input placeholder="Observation ID" value={diagnosticData.result} onChange={(e) => setDiagnosticData(prev => ({ ...prev, result: e }))}></Input>
            <Input placeholder="Conclusion" value={diagnosticData.conclusion} onChange={(e) => setDiagnosticData(prev => ({ ...prev, conclusion: e }))}></Input>
          </>}
          {formData.type === 'Observation' && <>
            <Input placeholder="Symptons" value={observationData.code.text} onChange={(e) => setObservationData(prev => ({ ...prev, code: { text: e } }))}></Input>
            <Input placeholder="Note" value={observationData.note[0].text} onChange={(e) => setObservationData(prev => ({ ...prev, note: [{text: e}] }))}></Input>
            <Input placeholder="Interpretation" value={observationData.interpretation.text} onChange={(e) => setObservationData(prev => ({ ...prev, interpretation: {text: e} }))}></Input>
          </>}
          {formData.type === 'MedicationRequest' && <>
            <Input placeholder="Medication" value={medicationData.medication.concept.coding.display} onChange={(e) => setMedicationData(prev => ({ ...prev, medication: { concept: { coding: { display: e } } } }))}></Input>
            <Input placeholder="Note" value={medicationData.note[0].text} onChange={(e) => setMedicationData(prev => ({ ...prev, note: [{text: e}] }))}></Input>
            <Input placeholder="Dosage Instruction" value={medicationData.dosageInstruction} onChange={(e) => setMedicationData(prev => ({ ...prev, dosageInstruction: e }))}></Input>
            <Input placeholder="Validity Date" value={endDate} onChange={(e) => setEndDate(e)} mask={dateMask}></Input>
            <Input placeholder="Quantity (ml)" value={medicationData.quantity.value} onChange={(e) => setMedicationData(prev => ({ ...prev, quantity: {value: e}}))}></Input>
          </>}
          <p>Patient ID: {location.state.patientId}</p>
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