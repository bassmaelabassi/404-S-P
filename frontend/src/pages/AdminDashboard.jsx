import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resUsers = await api.get('/api/admin/users');
      const resLogs = await api.get('/api/admin/logs');
      setUsers(resUsers.data);
      setLogs(resLogs.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <h3 className="font-semibold">Utilisateurs ({users.length})</h3>
      <ul className="list-disc ml-5">
        {users.map(u => <li key={u._id}>{u.username} ({u.email})</li>)}
      </ul>
      <h3 className="font-semibold mt-6">Historique</h3>
      <ul className="list-disc ml-5">
        {logs.map(log => <li key={log._id}>{log.action} - {log.timestamp}</li>)}
      </ul>
    </div>
  );
}
