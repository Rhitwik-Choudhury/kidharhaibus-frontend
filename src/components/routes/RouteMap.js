import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
const libraries = ['places'];
export function decodePolyline(encoded = '') {
  let index = 0, lat = 0, lng = 0; const points = [];
  const read = () => { let shift = 0, result = 0, byte; do { if (index >= encoded.length || shift > 30) throw new Error('Invalid polyline'); byte = encoded.charCodeAt(index++) - 63; result |= (byte & 31) << shift; shift += 5; } while (byte >= 32); return result & 1 ? ~(result >> 1) : result >> 1; };
  try { while (index < encoded.length) { lat += read(); lng += read(); points.push({ lat: lat / 1e5, lng: lng / 1e5 }); } } catch { return []; }
  return points;
}
export default function RouteMap({ stops = [], school, bus, selected, onSelect, remainingPolyline, completedPolyline, plannedPolyline, height = 450, live = false, viewportKey }) {
  const { isLoaded, loadError } = useJsApiLoader({ id: 'trackefy-google-map', googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '', libraries });
  const [map, setMap] = useState(null);
  const remaining = useMemo(() => decodePolyline(remainingPolyline), [remainingPolyline]);
  const completed = useMemo(() => decodePolyline(completedPolyline), [completedPolyline]);
  const planned = useMemo(() => decodePolyline(plannedPolyline), [plannedPolyline]);
  const initial = selected || bus || stops[0]?.location || school || { lat: 26.1445, lng: 91.7362 };
  const camera = useRef({ key: viewportKey, center: initial });
  const fitted = useRef(null);
  if (camera.current.key !== viewportKey) camera.current = { key: viewportKey, center: initial };
  function showRoute() {
    if (!map || !isLoaded) return;
    const points = [...stops.map(s => s.location), school, selected, bus, ...remaining, ...planned].filter(Boolean);
    if (points.length > 1) { const bounds = new window.google.maps.LatLngBounds(); points.forEach(p => bounds.extend(p)); map.fitBounds(bounds, 45); }
    else if (points[0]) { map.panTo(points[0]); map.setZoom(15); }
  }
  useEffect(() => {
    if (!map || !isLoaded) return;
    if (live) {
      if (fitted.current?.map === map && fitted.current?.key === viewportKey) return;
      showRoute(); fitted.current = { map, key: viewportKey }; return;
    }
    const points = [...stops.map(s => s.location), school, selected].filter(Boolean);
    if (points.length > 1) { const bounds = new window.google.maps.LatLngBounds(); points.forEach(p => bounds.extend(p)); map.fitBounds(bounds, 45); }
    else if (points[0]) { map.panTo(points[0]); map.setZoom(15); }
  }, [map, isLoaded, school, selected, stops, live, viewportKey]);
  if (loadError || !process.env.REACT_APP_GOOGLE_MAPS_API_KEY) return <div className="route-map-empty" role="status">Map unavailable. You can still review stops and save drafts.</div>;
  if (!isLoaded) return <div className="route-map-empty" role="status">Loading map…</div>;
  return <div style={{ position: 'relative' }}><GoogleMap mapContainerStyle={{ height, width: '100%', borderRadius: 16 }} center={live ? camera.current.center : initial} zoom={13} onLoad={setMap} options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true }} onClick={event => onSelect?.({ lat: event.latLng.lat(), lng: event.latLng.lng() })}>
    {planned.length > 0 && <Polyline path={planned} options={{ strokeColor: '#cbd5e1', strokeWeight: 7, strokeOpacity: 0.5 }} />}
    {completed.length > 0 && <Polyline path={completed} options={{ strokeColor: '#94a3b8', strokeWeight: 5 }} />}
    {remaining.length > 0 && <Polyline path={remaining} options={{ strokeColor: '#2563eb', strokeWeight: 5 }} />}
    {stops.map((stop, index) => <Marker key={stop.id || stop._id || index} position={stop.location} label={String(index + 1)} title={stop.name} />)}
    {school && <Marker position={school} label="S" title="School" />}
    {bus && <Marker position={bus} label="B" title="Bus" />}
    {selected && <Marker position={selected} title="Selected location" draggable={!!onSelect} onDragEnd={event => onSelect?.({ lat: event.latLng.lat(), lng: event.latLng.lng() })} />}
  </GoogleMap>{live && <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}><button type="button" disabled={!bus || !map} onClick={() => map?.panTo(bus)} style={{ background: '#fff', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}>Center on bus</button><button type="button" onClick={showRoute} style={{ background: '#fff', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}>Show whole route</button></div>}</div>;
}
