import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { vaccinationAPI, animalsAPI } from '../../utils/api';
import QuickNav from '../../components/common/QuickNav';

const VACCINE_TYPES = ['Vaccine', 'Medicine', 'Antibiotic', 'Supplement', 'Other'];
const STATUSES = ['Given', 'Scheduled', 'Overdue'];

const defaultForm = {
  animal: '', vaccineName: '', vaccineType: 'Medicine',
  dosage: '', date: new Date().toISOString().split('T')[0],
  nextDueDate: '', givenBy: '', cost: '', notes: '', status: 'Given'
};

export default function VaccinationRecords() {
  const [records, setRecords]       = useState([]);
  const [animals, setAnimals]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm]             = useState(defaultForm);
  const [saving, setSaving]         = useState(false);
  const [filterAnimal, setFilterAnimal] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [recRes, animRes] = await Promise.all([
        vaccinationAPI.getAll({ animalId: filterAnimal }),
        animalsAPI.getAll()
      ]);
      setRecords(recRes.data.records || []);
      setAnimals(animRes.data.animals || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterAnimal]);

  const openAdd = () => {
    setEditRecord(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRecord(r);
    setForm({
      animal:      r.animal?._id || '',
      vaccineName: r.vaccineName || '',
      vaccineType: r.vaccineType || 'Medicine',
      dosage:      r.dosage || '',
      date:        r.date ? r.date.split('T')[0] : '',
      nextDueDate: r.nextDueDate ? r.nextDueDate.split('T')[0] : '',
      givenBy:     r.givenBy || '',
      cost:        r.cost || '',
      notes:       r.notes || '',
      status:      r.status || 'Given'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editRecord) {
        await vaccinationAPI.update(editRecord._id, form);
        toast.success('Record updated! ✅');
      } else {
        await vaccinationAPI.create(form);
        toast.success('Vaccination recorded! 💉');
      }
      setShowModal(false);
      setForm(defaultForm);
      setEditRecord(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await vaccinationAPI.delete(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRecord(null);
    setForm(defaultForm);
  };

  const statusMap = {
    Given:     'badge-green',
    Scheduled: 'badge-orange',
    Overdue:   'badge-red'
  };

  const typeMap = {
    Vaccine:     'badge-blue',
    Medicine:    'badge-purple',
    Antibiotic:  'badge-red',
    Supplement:  'badge-green',
    Other:       'badge-gray'
  };

  const totalCost     = records.reduce((s, r) => s + (r.cost || 0), 0);
  const givenCount    = records.filter(r => r.status === 'Given').length;
  const scheduledCount = records.filter(r => r.status === 'Scheduled').length;
  const overdueCount  = records.filter(r => r.status === 'Overdue').length;

  return (
    <div className="page-vaccination">
      <div className="page-header">
        <div>
          <h2>💉 Vaccination Records</h2>
          <p>Track medicines & vaccinations</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Record</button>
      </div>

      <div className="page-content">
        <QuickNav></QuickNav>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Records', value: records.length,  icon: '💉', cls: 'green'  },
            { label: 'Given',         value: givenCount,       icon: '✅', cls: 'blue'   },
            { label: 'Scheduled',     value: scheduledCount,   icon: '📅', cls: 'orange' },
            { label: 'Total Cost',    value: `PKR ${totalCost.toLocaleString()}`, icon: '💰', cls: 'purple' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
              <div className="stat-info">
                <div className="value" style={{ fontSize: s.label === 'Total Cost' ? '1.1rem' : '1.8rem' }}>
                  {s.value}
                </div>
                <div className="label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <div style={{
            background: '#fde8ea', border: '1px solid #f5c6cb',
            borderRadius: '10px', padding: '14px 20px',
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <div>
              <strong style={{ color: '#c62828' }}>
                {overdueCount} overdue vaccination{overdueCount > 1 ? 's' : ''}!
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#c62828', margin: 0 }}>
                Please check and update the records below.
              </p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="filter-bar">
          <select className="search-input"
            style={{ flex: 'none', width: 'auto', minWidth: '200px' }}
            value={filterAnimal} onChange={e => setFilterAnimal(e.target.value)}>
            <option value="">All Animals</option>
            {animals.map(a => (
              <option key={a._id} value={a._id}>{a.name || a.tagId} ({a.species})</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="card">
          {loading ? (
            <div className="empty-state"><p>Loading...</p></div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💉</div>
              <h3>No vaccination records</h3>
              <p>Start tracking medicines and vaccinations for your animals</p>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Record</button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Vaccine / Medicine</th>
                    <th>Type</th>
                    <th>Dosage</th>
                    <th>Date</th>
                    <th>Next Due</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r._id}>
                      <td>
                        <strong>{r.animal?.name || r.animal?.tagId || '—'}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {r.animal?.species}
                        </div>
                      </td>
                      <td>
                        <strong>{r.vaccineName}</strong>
                        {r.givenBy && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            By: {r.givenBy}
                          </div>
                        )}
                      </td>
                      <td><span className={`badge ${typeMap[r.vaccineType]}`}>{r.vaccineType}</span></td>
                      <td>{r.dosage || '—'}</td>
                      <td>{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                      <td>
                        {r.nextDueDate ? (
                          <span style={{ color: new Date(r.nextDueDate) < new Date() ? 'var(--danger)' : 'var(--text)' }}>
                            {new Date(r.nextDueDate).toLocaleDateString()}
                          </span>
                        ) : '—'}
                      </td>
                      <td>{r.cost ? `PKR ${Number(r.cost).toLocaleString()}` : '—'}</td>
                      <td><span className={`badge ${statusMap[r.status]}`}>{r.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editRecord ? 'Edit Record' : 'Add Vaccination Record'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Animal *</label>
                    <select value={form.animal}
                      onChange={e => setForm(p => ({ ...p, animal: e.target.value }))} required>
                      <option value="">Select animal</option>
                      {animals.map(a => (
                        <option key={a._id} value={a._id}>{a.name || a.tagId} ({a.species})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Vaccine / Medicine Name *</label>
                    <input value={form.vaccineName}
                      onChange={e => setForm(p => ({ ...p, vaccineName: e.target.value }))}
                      placeholder="e.g. Foot & Mouth Vaccine" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select value={form.vaccineType}
                      onChange={e => setForm(p => ({ ...p, vaccineType: e.target.value }))}>
                      {VACCINE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Dosage</label>
                    <input value={form.dosage}
                      onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))}
                      placeholder="e.g. 5ml, 2 tablets" />
                  </div>
                  <div className="form-group">
                    <label>Given By</label>
                    <input value={form.givenBy}
                      onChange={e => setForm(p => ({ ...p, givenBy: e.target.value }))}
                      placeholder="e.g. Dr. Ahmed" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Next Due Date</label>
                    <input type="date" value={form.nextDueDate}
                      onChange={e => setForm(p => ({ ...p, nextDueDate: e.target.value }))} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cost (PKR)</label>
                  <input type="number" value={form.cost}
                    onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
                    min="0" placeholder="0" />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    rows={3} style={{ resize: 'vertical' }}
                    placeholder="Any observations or additional notes..." />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editRecord ? 'Update Record' : 'Add Record 💉'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}