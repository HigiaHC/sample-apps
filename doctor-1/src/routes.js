import React from 'react';
import { Route, BrowserRouter, Routes as Switch } from 'react-router-dom';


import { Homepage } from './pages/index';
import { Patients } from './pages/patients';

export const Routes = () => (
    <BrowserRouter basename="/">
        <Switch>
            <Route path="/" element={<Homepage />} />
            <Route path="/patients" element={<Patients />} />
        </Switch>
    </BrowserRouter>
);