import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
const sessionId = () => window.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.floor(Math.random() * 16); return (c === 'x' ? r : (r & 3) | 8).toString(16); });
export default function PlaceSearch({ onSelect, bias }) {
  const [query, setQuery] = useState(''), [results, setResults] = useState([]), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const token = useRef(sessionId()), selected = useRef(false);
  useEffect(() => {
    if (selected.current) { selected.current = false; return; }
    if (query.trim().length < 3) { setResults([]); return; }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setBusy(true); setError('');
      try { const { data } = await api.post('/places/autocomplete', { input: query, sessionToken: token.current, ...(bias ? { locationBias: { latitude: bias.lat, longitude: bias.lng } } : {}) }, { signal: controller.signal }); setResults(data.suggestions || []); }
      catch (e) { if (!controller.signal.aborted) setError('Location search unavailable. Select the point on the map.'); }
      finally { if (!controller.signal.aborted) setBusy(false); }
    }, 350);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query, bias]);
  async function choose(item) {
    setBusy(true); setError('');
    try { const { data } = await api.get(`/places/${encodeURIComponent(item.placeId)}`, { params: { sessionToken: token.current } }); selected.current = true; setQuery(data.formattedAddress); setResults([]); onSelect({ location: { lat: data.location.latitude, lng: data.location.longitude }, formattedAddress: data.formattedAddress, placeId: data.placeId }); token.current = sessionId(); }
    catch { setError('Could not open this location. Please try again.'); } finally { setBusy(false); }
  }
  return <div className="route-place-search"><label>Search a location<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Street, landmark, or school" autoComplete="off" /></label>{busy && <small role="status">Searching…</small>}{error && <p role="alert">{error}</p>}{results.length > 0 && <div className="route-search-results">{results.map(item => <button type="button" key={item.placeId} onClick={() => choose(item)}><strong>{item.mainText}</strong><small>{item.secondaryText}</small></button>)}<small>Powered by Google</small></div>}</div>;
}
