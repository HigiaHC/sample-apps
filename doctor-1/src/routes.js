import React from 'react';
import { Route, BrowserRouter, Routes as Switch } from 'react-router-dom';
import { Appointment } from './pages/appointment';


import { Homepage } from './pages/index';
import { Patients } from './pages/patients';
import { StartAppointment } from './pages/start-appointment';

export const Routes = () => (
    <BrowserRouter basename="/">
        <Switch>
            <Route path="/" element={<Homepage />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/start-appointment/:address" element={<StartAppointment />} />
            <Route path="/appointment/:address" element={<Appointment />} />
        </Switch>
    </BrowserRouter>
);