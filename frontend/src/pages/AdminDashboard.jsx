import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // New modern CSS file

axios.defaults.baseURL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionData, setActionData] = useState({ status: '', comments: '' });
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    setAdmin({ name: user.name, email: user.email });
    fetchLeaves();
  }, [navigate]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/leaves/all', { headers: { Authorization: `Bearer ${token}` } });
      setLeaves(response.data.data);
      calculateStats(response.data.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter(l => l.status === 'pending').length,
      approved: data.filter(l => l.status === 'approved').length,
      rejected: data.filter(l => l.status === 'rejected').length
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleActionClick = (leave, status) => {
    setSelectedLeave(leave);
    setActionData({ status, comments: '' });
    setShowActionModal(true);
  };

  const handleCloseModal = () => {
    setShowActionModal(false);
    setSelectedLeave(null);
    setActionData({ status: '', comments: '' });
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/leaves/${selectedLeave._id}/status`, actionData, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Leave ${actionData.status} successfully!`);
      handleCloseModal();
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert('Failed to update leave.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  const getStatusBadge = (status) => {
    const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[status] || 'badge-secondary'}`}>{status.toUpperCase()}</span>;
  };

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard-modern">
      {/* Header */}
      <header className="dashboard-header-modern">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, <strong>{admin.name}</strong></p>
        </div>
        <div className="header-right">
          <button className="btn-logout-modern" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card total">
          <h3>Total Requests</h3>
          <p>{stats.total}</p>
        </div>
        <div className="card pending">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="card approved">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="card rejected">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>

      {/* Leave Table */}
      <div className="leave-table-wrapper">
        {leaves.length === 0 ? (
          <div className="no-leaves">
            <p>No leave requests yet</p>
          </div>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Dept</th>
                <th>Period</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l._id}>
                  <td>{l.user?.name}</td>
                  <td>{l.user?.department || 'General'}</td>
                  <td>{formatDate(l.startDate)} - {formatDate(l.endDate)}</td>
                  <td>{l.totalDays}</td>
                  <td>{l.reason}</td>
                  <td>{getStatusBadge(l.status)}</td>
                  <td>
                    {l.status === 'pending' && (
                      <div className="actions-buttons-modern">
                        <button className="btn-approve" onClick={() => handleActionClick(l, 'approved')}>Approve</button>
                        <button className="btn-reject" onClick={() => handleActionClick(l, 'rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedLeave && (
        <div className="modal-backdrop-modern">
          <div className="modal-modern">
            <h3>{actionData.status === 'approved' ? 'Approve' : 'Reject'} Leave</h3>
            <p>Leave request from <strong>{selectedLeave.user?.name}</strong></p>
            <textarea
              placeholder="Add optional comments"
              value={actionData.comments}
              onChange={e => setActionData(prev => ({ ...prev, comments: e.target.value }))}
              maxLength={200}
              disabled={processing}
            />
            <div className="modal-buttons-modern">
              <button onClick={handleCloseModal} disabled={processing}>Cancel</button>
              <button onClick={handleActionSubmit} disabled={processing}>
                {processing ? 'Processing...' : actionData.status === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
