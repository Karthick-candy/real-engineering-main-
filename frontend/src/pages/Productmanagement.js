import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Form, Input, Spin, message, Modal, Upload, Select } from 'antd';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/Productmanagement.css'; // Import the CSS file

const API_URL = 'http://localhost:8000'; // Adjust as needed

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`${API_URL}/api/get_products/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isEditing = (record) => record.id === editingKey;

  const handleEdit = (record) => {
    setEditingKey(record.id);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      price: record.price,
      description: record.description,
      category: record.category,
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('access');
      await axios.put(`${API_URL}/api/update_product/${values.id}/`, values, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const response = await axios.get(`${API_URL}/api/get_products/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProducts(response.data);
      setEditingKey('');
      message.success('Product details updated successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Failed to update product details');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${API_URL}/api/delete_product/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const response = await axios.get(`${API_URL}/api/get_products/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProducts(response.data);
      message.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleAddProduct = async (values) => {
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('category', values.category);
      
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);  // Add the file to FormData
      }
  
      await axios.post(`${API_URL}/api/add_product/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const productsResponse = await axios.get(`${API_URL}/api/get_products/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProducts(productsResponse.data);
      message.success('Product added successfully');
      setIsAddProductVisible(false);
      setFileList([]);
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Failed to add product');
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      editable: true,
      className: 'description-cell',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 250,
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
                title="Are you sure you want to delete this product?"
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

  const handleAddProductClick = () => {
    form.resetFields(); // Reset form fields
    setIsAddProductVisible(true);
  };

  const handleAddProductModalOk = () => {
    form
      .validateFields()
      .then(values => {
        handleAddProduct(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleAddProductModalCancel = () => {
    setIsAddProductVisible(false);
    setFileList([]);
  };

  return (
    <div className="product-management-container">
      <h2 className="product-management-title">Product Management</h2>
      <Button
        type="primary"
        onClick={handleAddProductClick}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>
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
            dataSource={products}
            rowKey="id"
            pagination={false}
            bordered
            className="product-management-table"
          />
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
        </Form>
      )}
      <Modal
        title="Add Product"
        visible={isAddProductVisible}
        onOk={handleAddProductModalOk}
        onCancel={handleAddProductModalCancel}
      >
        <Form form={form} layout="vertical" name="add_product_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the product description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the product price!' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please input the product category!' }]}
          >
            <Select placeholder="Select a category">
              <Select.Option value="Springs">Springs</Select.Option>
              <Select.Option value="Accessories">Accessories</Select.Option>
              <Select.Option value="Machineries">Machineries</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps} className={dataIndex === 'description' ? 'description-cell' : ''}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          {dataIndex === 'category' ? (
            <Select placeholder="Select a category">
              <Select.Option value="Springs">Springs</Select.Option>
              <Select.Option value="Accessories">Accessories</Select.Option>
              <Select.Option value="Machineries">Machineries</Select.Option>
            </Select>
          ) : (
            <Input />
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default ProductManagement;
