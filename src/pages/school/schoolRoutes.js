// src/routes/schoolRoutes.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import DashboardLayout from './DashboardLayout';
import Overview from './Overview';
import Students from './Students';
import Drivers from './Drivers';
import Buses from './Buses';
import Trips from './Trips';
import Alerts from './Alerts';
import Settings from './Settings';

const schoolRoutes = (
  <Route path="/school" element={<DashboardLayout />}>
    <Route path="dashboard" element={<Overview />} />
    <Route path="students" element={<Students />} />
    <Route path="drivers" element={<Drivers />} />
    <Route path="buses" element={<Buses />} />
    <Route path="trips" element={<Trips />} />
    <Route path="alerts" element={<Alerts />} />
    <Route path="settings" element={<Settings />} />
    <Route index element={<Navigate to="dashboard" />} />
  </Route>
);

export default schoolRoutes;
