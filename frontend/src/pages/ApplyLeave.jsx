import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ApplyLeave.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    if (parsedUser.role !== 'employee') {
      navigate('/login');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { leaveType, startDate, endDate, reason } = formData;

    if (!leaveType || !startDate || !endDate || !reason) {
      setError('Please fill in all fields.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/leaves/apply`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Leave request submitted successfully!');
        setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
      } else {
        setError(response.data.message || 'Failed to submit leave request.');
      }
    } catch (err) {
      console.error('Error submitting leave:', err);
      const msg = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(msg);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-leave-container">
      <div className="apply-leave-card">
        <h2>Apply for Leave</h2>
        <p>Fill out the form below to request leave.</p>

        {error && <div className="form-alert error">{error}</div>}
        {success && <div className="form-alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="apply-leave-form">
          <div className="form-group">
            <label>Leave Type</label>
            <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
              <option value="">Select leave type</option>
              <option value="sick">Sick</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
              <option value="bereavement">Bereavement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="Provide a reason for your leave"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
