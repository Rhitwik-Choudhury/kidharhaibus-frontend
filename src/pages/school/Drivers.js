import { useEffect, useState } from 'react';
import { driversAPI, handleAPIError } from '../../services/api';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [editing, setEditing] = useState(null), [phone, setPhone] = useState(''), [saving, setSaving] = useState(false), [message, setMessage] = useState('');
  useEffect(() => {
    let disposed = false;
    driversAPI.getDrivers().then(({ data }) => { if (!disposed) setDrivers(data.drivers || []); }).catch(e => { if (!disposed) setError(handleAPIError(e)); }).finally(() => { if (!disposed) setLoading(false); });
    return () => { disposed = true; };
  }, []);
  async function save(e) {
    e.preventDefault(); if (saving) return;
    setSaving(true); setError(''); setMessage('');
    try { const { data } = await driversAPI.updateContact(editing._id, phone); setDrivers(current => current.map(d => d._id === editing._id ? { ...d, phone: data.driver.phone } : d)); setEditing(null); setMessage('Driver contact number updated. Parents can now contact this driver.'); }
    catch (e) { setError(handleAPIError(e)); }
    finally { setSaving(false); }
  }
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold text-slate-900">Drivers</h1><p className="mt-2 text-sm text-slate-500">Manage contact numbers for drivers linked to your school.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}{message && <p role="status" className="rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}
    {loading ? <p>Loading drivers…</p> : !drivers.length ? <p>No drivers linked yet. Drivers can register using your School Code.</p> : <div className="grid gap-4 md:grid-cols-2">{drivers.map(driver => <div key={driver._id} className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">{driver.fullName}</h2><p className="text-sm text-slate-500">{driver.email}</p><p className="mt-3 text-sm">Bus: {driver.busId?.busNumber || 'Unassigned'}</p><p className="mt-1 text-sm">Phone: {driver.phone || 'Contact number unavailable'}</p><button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditing(driver); setPhone(driver.phone || ''); setError(''); setMessage(''); }}>Edit Contact</button></div>)}</div>}
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={save} role="dialog" aria-modal="true" aria-labelledby="contact-title" className="w-full max-w-md rounded-2xl bg-white p-6"><h2 id="contact-title" className="text-xl font-bold">Contact for {editing.fullName}</h2><p className="my-3 text-sm text-slate-500">This number is shared with parents linked to the driver’s assigned bus.</p><label className="block text-sm font-medium" htmlFor="driver-phone">Phone number</label><input id="driver-phone" type="tel" autoComplete="tel" maxLength={24} value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile or +country code" required className="mt-2 w-full rounded-lg border p-3" />{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}<div className="mt-5 flex justify-end gap-3"><button type="button" disabled={saving} onClick={() => setEditing(null)}>Cancel</button><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-white">{saving ? 'Saving…' : 'Save Number'}</button></div></form></div>}
  </div>;
}
