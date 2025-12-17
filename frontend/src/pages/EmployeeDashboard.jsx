// EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    fetchLeaves();
  }, [navigate]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/leaves/my-leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Function to get name from email (ignores numbers)
  const getNameFromEmail = (email) => {
    if (!email) return '';
    const namePart = email.split('@')[0]; // before @
    const nameWithoutNumbers = namePart.replace(/\d+/g, ''); // remove numbers
    const words = nameWithoutNumbers.split(/[\._]/).filter(Boolean); // split by dot or underscore
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard employee-dashboard">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <h2>Welcome, {user?.name || getNameFromEmail(user?.email)}</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </nav>

      <main className="dashboard-main">
        {/* Employee Info Cards */}
        <section className="employee-info-cards">
          <div className="card">
            <h3>Employee ID</h3>
            <p>{user?.employeeId}</p>
          </div>
          <div className="card">
            <h3>Employee Name</h3>
            <p>{user?.name || getNameFromEmail(user?.email)}</p>
          </div>
          <div className="card">
            <h3>Department</h3>
            <p>{user?.department}</p>
          </div>
          <div className="card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>
        </section>

        {/* Leaves Table */}
        <section className="leaves-section">
          <div className="leaves-header">
            <h3>Your Leave Requests</h3>
            <button className="btn-primary" onClick={() => navigate('/employee/apply-leave')}>
              Apply for Leave
            </button>
          </div>

          <div className="leaves-table-container">
            <table className="leaves-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-leaves">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  leaves.map(leave => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.totalDays}</td>
                      <td>
                        <span className={`status-badge ${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>{new Date(leave.appliedDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
