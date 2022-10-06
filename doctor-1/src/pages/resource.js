import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactJson from "react-json-view";
import styled from "styled-components";
import { Header } from "../components/header";
import { Button } from "../components/button";
import api from "../services/api";

export const Resource = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [content, setContent] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    let key = localStorage.getItem(params.patient).split(':')[1];
    setToken(key);

    async function loadResource(key) {
      let resource = await api.get(`resources/${params.patient}/${params.type}/${params.id}`, {
        headers: {
          Authorization: key
        }
      })
      setContent(resource.data);
    }

    loadResource(key);
  }, []);

  return (
    <>
      <Header></Header>
      <Wrapper>
        <Center>
          <Actions>
            <Button fullWidth={false} onClick={() => navigate(`/appointment/${params.patient}`)}>Back to appointment</Button>
          </Actions>
          <ReactJson src={content} theme="monokai" style={{ padding: 16, borderRadius: 8, maxHeight: 640, overflowY: 'auto' }} />
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

  display: flex;
  flex-direction: column;
  gap: 32px;
`

const Actions = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 24px;
`