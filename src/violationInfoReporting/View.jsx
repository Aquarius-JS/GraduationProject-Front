import React from 'react';
import { useModelState } from 'react-imvc/hook';
import { Style } from 'react-imvc/component';
import BottomNavigation from './components/BottomNavigation';
import VehicleInfoQuery from './components/VehicleInfoQuery';
import UnregisteredReporting from './components/UnregisteredReporting';

export default function () {
  const state = useModelState();
  const tap = state.urlParams.tap;
  return (
    <>
      <Style name="vio" />
      <BottomNavigation />
      {tap == undefined && <VehicleInfoQuery />}
      {tap === 'vehicle-info-query' && <VehicleInfoQuery />}
      {tap === 'violation-reporting' && <div>违规车辆信息上报</div>}
      {tap === 'unregistered-reporting' && <UnregisteredReporting />}
    </>
  );
}
