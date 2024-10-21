import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { verifyToken } from '../services/AuthService';
import { Form, Table, Button, Popconfirm, Spin, message, Input } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/Admindashboard.css'; // Import the CSS file

const API_URL = 'http://localhost:8000'; // Adjust as needed

const AdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`${API_URL}/api/get_admins/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const isEditing = (record) => record.id === editingKey;

  const handleEdit = (record) => {
    setEditingKey(record.id);
    form.setFieldsValue({
      id: record.id,
      username: record.username,
      email: record.email,
      first_name: record.first_name,
      last_name: record.last_name,
      phone_number: record.phone_number,
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access');
  
    try {
      // Validate form fields
      const values = await form.validateFields();
  
      // Save the updated details to the server
      await axios.put(`${API_URL}/api/update_admin/${values.id}/`, values, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Fetch the updated list of admins from the server
      const updatedAdminsResponse = await axios.get(`${API_URL}/api/get_admins/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Update the admin list with the server's response data
      setAdmins(updatedAdminsResponse.data);
      setEditingKey('');
      message.success('Admin details updated successfully');
    } catch (error) {
      console.error('Error saving admin:', error);
      message.error('Failed to update admin details');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${API_URL}/api/delete_admin/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      message.success('Admin deleted successfully');
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch (error) {
      console.error('Error deleting admin:', error);
      message.error('Failed to delete admin');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      editable: true,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      width: 150,
      editable: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      width: 150,
      editable: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 150,
      editable: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <>
          {isEditing(record) ? (
            <>
              <Button onClick={handleSave} type="primary" size="small">Save</Button>
              <Button onClick={() => setEditingKey('')} size="small" style={{ marginLeft: 8 }}>Cancel</Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleEdit(record)} type="link" size="small">Modify</Button>
              <Popconfirm
                title="Are you sure you want to delete this admin?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger size="small" style={{ marginLeft: 8 }}>Delete</Button>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={admins}
            rowKey="id"
            pagination={false}
            bordered
            className="admin-panel-table"
          />
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

// Editable Cell Component
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  editing,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `${title} is required.` }]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokens = async () => {
      try {
        const isValid = await verifyToken();
        if (isValid) {
          setTimeout(() => {
            setLoading(false);
          }, 2000); // Display spinner for 2 seconds
        } else {
          navigate('/admin-login');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        navigate('/admin-login');
      }
    };

    checkTokens();
  }, [navigate]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-dashboard-sidebar">
        <ul>
          <li><Link className="nav-link">Admin Panel</Link></li>
          <li><Link to="/admin-dashboard/admin-register" className="nav-link">Admin Registration</Link></li>
          <li><Link to="/admin-dashboard/product-management" className="nav-link">Product Management</Link></li>
          <li><Link to="/admin-dashboard/order-management" className="nav-link">Order Management</Link></li>
        </ul>
      </nav>
      <div className="admin-dashboard-content">
        <AdminPanel /> {/* Render AdminPanel by default */}
      </div>
    </div>
  );
};

export default AdminDashboard;
