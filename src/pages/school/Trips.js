import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import socket from '../../lib/socket';
import RouteMap from '../../components/routes/RouteMap';
import './RoutesStops.css';
export default function Trips() {
  const [buses, setBuses] = useState([]), [selected, setSelected] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(true), [connected, setConnected] = useState(socket.connected), [now, setNow] = useState(Date.now());
  const inFlight = useRef(false);
  useEffect(() => {
    let cancelled = false;
    async function load() { if (inFlight.current) return; inFlight.current = true; try { const { data } = await api.get('/school/trips'); if (!cancelled) { setBuses(data.buses || []); setSelected(current => current || data.buses?.[0]?.id || ''); setError(''); } } catch { if (!cancelled) setError('Unable to refresh trips. Retrying shortly.'); } finally { inFlight.current = false; if (!cancelled) setLoading(false); } }
    const join = () => { setConnected(true); socket.emit('joinSchoolRoom', {}); load(); };
    const disconnect = () => setConnected(false);
    const update = trip => setBuses(current => current.map(bus => bus.id === trip.busId ? { ...bus, trip: trip.status === 'active' ? trip : null } : bus));
    socket.on('connect', join); socket.on('disconnect', disconnect); socket.on('trip-detail', update);
    if (socket.connected) join(); else socket.connect();
    load(); const poll = setInterval(load, 10000), clock = setInterval(() => setNow(Date.now()), 5000);
    return () => { cancelled = true; clearInterval(poll); clearInterval(clock); socket.off('connect', join); socket.off('disconnect', disconnect); socket.off('trip-detail', update); };
  }, []);
  useEffect(() => { if (!selected) return; socket.emit('joinBusRoom', { busId: selected }); return () => socket.emit('leaveBusRoom', { busId: selected }); }, [selected]);
  const bus = buses.find(b => b.id === selected), trip = bus?.trip;
  const stale = trip && (!trip.lastLocationUpdatedAt || now - Date.parse(trip.lastLocationUpdatedAt) > 30000);
  return <main className="routes-workspace"><header className="route-header"><div><h1>Live trips</h1><p>Monitor each bus, its next stop, and route progress.</p></div><span className={`route-badge ${connected ? '' : 'warn'}`}>{connected ? 'Live connection' : 'Reconnecting · periodic updates active'}</span></header>{error && <div className="route-error" role="alert">{error}</div>}{loading && <div className="route-card" role="status">Loading buses…</div>}
    <div className="route-grid">{buses.map(b => <button key={b.id} aria-pressed={selected === b.id} onClick={() => setSelected(b.id)}><strong>{b.busNumber}</strong><small>{b.trip ? b.trip.direction === 'TO_SCHOOL' ? 'Morning Pickup' : 'Return Drop-off' : 'Not started'}</small><span className="route-badge">{b.trip ? `${b.trip.nextStopIndex}/${b.trip.totalStopCount} stops completed` : 'Waiting'}</span><small>{b.driver?.fullName || 'Driver not assigned'}</small></button>)}</div>
    {!loading && !buses.length && <div className="route-card">Your buses will appear here once they are added.</div>}
    {bus && !trip && <div className="route-card"><h2>{bus.busNumber}</h2><p>This bus has not started a trip.</p></div>}
    {trip && <div className="route-split"><section className="route-card"><div className="route-row"><h2>{bus.busNumber} · {trip.direction === 'TO_SCHOOL' ? 'Morning Pickup' : 'Return Drop-off'}</h2><span className="route-badge">{trip.mode === 'route' ? `Route v${trip.routePlanVersion}` : 'Live tracking only'}</span></div>{stale && <p className="route-error">Location is stale. The driver may be offline.</p>}{(trip.offRoute || trip.routeState === 'rerouting') && <p className="route-error">Bus route is being recalculated.</p>}<RouteMap stops={trip.stops || []} school={trip.schoolLocation} bus={trip.currentLocation} remainingPolyline={trip.remainingPolyline} completedPolyline={trip.completedPolyline} plannedPolyline={trip.plannedPolyline} /><p className="route-muted">Last update: {trip.lastLocationUpdatedAt ? new Date(trip.lastLocationUpdatedAt).toLocaleTimeString() : 'Waiting for GPS'}</p></section><section className="route-card"><h2>Trip progress</h2><p>Driver: {bus.driver?.fullName || 'Assigned driver'}</p><div className="route-stat">{trip.remainingStopCount} stops remaining</div><p>Next: {trip.nextStop?.name || (trip.direction === 'TO_SCHOOL' ? 'School' : 'Route complete')}</p><p>{trip.direction === 'TO_SCHOOL' ? 'School' : 'Final stop'} arrival: {!stale && trip.terminalEta ? new Date(trip.terminalEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unavailable'}</p><ol className="route-list route-list-scroll">{(trip.stops || []).map((stop, index) => <li key={stop.routeStopId}><span className="stop-number">{index + 1}</span><div className="stop-text"><strong>{stop.name}</strong><small>{stop.students?.map(s => s.name).join(', ')}</small><span className="route-badge">{stop.status}</span>{stop.skipReason && <small>{stop.skipReason}</small>}</div></li>)}</ol></section></div>}
  </main>;
}
