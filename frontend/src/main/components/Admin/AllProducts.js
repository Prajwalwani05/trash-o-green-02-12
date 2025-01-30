import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useRowSelect, useSortBy } from 'react-table';
import { Box, Button, Typography, CircularProgress, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, styled } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedProducts, setEditedProducts] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
  const [productsToDelete, setProductsToDelete] = useState(null); // To store user id for deletion
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message to show in snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severity of the snackbar (success or error)
  const [openAddDialog, setOpenAddDialog] = useState(false); // For opening/closing add dialog
  const [newProduct, setNewProduct] = useState({ productName: '', marketPrice: '', originalPrice: '', image: '', quantity: '' }); // New user state
  // Fetch users from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${REACT_APP_API_URL}/api/products/getAllProducts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

//Add Product
  const handleAddProduct = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await axios.post(`${REACT_APP_API_URL}/api/products/addProduct`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts([...products, response.data]); // Add new user to the state
        setOpenAddDialog(false); // Close add user dialog
        setSnackbarMessage('Product added successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setNewProduct({ productName: '', marketPrice: '', originalPrice: '', image: '', quantity: '' }); // Reset the form
      }  
    catch (err) {
     setOpenAddDialog(false);
     setSnackbarMessage('Error adding product');
     setSnackbarSeverity('error');
     setOpenSnackbar(true);
   }
  };

  const handleEdit = (user) => {
    setEditedProducts({ ...user });
  };

  const handleCancel = () => {
    setEditedProducts(null);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
          // Prepare the data to be sent, including the document if it's updated
     // Convert file to base64 if document is present
     let updatedData = { ...editedProducts };
      const response = await axios.put(
        `${REACT_APP_API_URL}/api/products/updateProduct/${editedProducts.id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUsers = products.map((user) =>
        user.id === editedProducts.id ? response.data : user
      );
      setProducts(updatedUsers);
      setSnackbarMessage('Products updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true); // Show success snackbar
      setEditedProducts(null);
    } catch (err) {
      setSnackbarMessage('Error updating products');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); // Show error snackbar
    }
  };
  const handleDelete = (id) => {
    setProductsToDelete(id); // Store the user id to delete
    setOpenDialog(true);  // Open the confirmation dialog
  };

  const handleDeleteConfirm = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${REACT_APP_API_URL}/api/products/deleteProduct/${productsToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((user) => user.id !== setProductsToDelete));
      setSnackbarMessage('Product delete successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true); // Show success snackbar
      setOpenDialog(false);
    } catch (err) {
      setSnackbarMessage('Error deleting product');
      setSnackbarSeverity('error');
      setOpenDialog(false);
    }
  };
  const handleDeleteCancel = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close snackbar
  };
  // Column definitions
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Product Name', accessor: 'productName' },
      { Header: 'Market Price', accessor: 'marketPrice' },
      { Header: 'Original Price', accessor: 'originalPrice' },
      { Header: 'Image', accessor: 'image' },
      { Header: 'Quantity', accessor: 'quantity' },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          const user = row.original;
          return (
            <Box sx={{display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}>
              {editedProducts?.id === user.id ? (
                <>
                  <Button
                    onClick={handleSave}
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    size="small"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    size="small"
                    style={{ marginLeft: '10px' }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleEdit(user)}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(user.id)}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    size="small"
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>
          );
        },
      },
    ],
    [editedProducts, products]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data: products, initialState: { selectedRowIds: {} } },
    useSortBy,
    useRowSelect
  );
  
  // Loading and error states
  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;


  return (
    <Box mt={0} p={2} style={{ height: '100%', width: '100%' }}>
      <Typography style={{textAlign:'center'}} mb={2} variant="h5">All Products</Typography>
      <Button startIcon={<AddCircleIcon />} variant="text" color="secondary" onClick={() => setOpenAddDialog(true)}>
        Add Product
      </Button>
      <Box sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px" }}>
        <div style={{ overflowX: 'auto', padding:'0' }}>
        <table className='adminTable' {...getTableProps()} >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} style={{ padding: '10px', textAlign: 'left', backgroundColor:'#023e7d', color:'#FFFFFF' }}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr 
                {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const isEditable = editedProducts?.id === row.original.id;
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: '10px',
                          textAlign: 'left',
                          border: '1px solid #eaf4f4',
                        }}
                      >
                        { cell.column.id === 'productName' ||
                          cell.column.id === 'marketPrice' ||
                          cell.column.id === 'originalPrice' || 
                          cell.column.id === 'image' ||
                          cell.column.id === 'quantity' 
                           ? (
                          isEditable ? (
                            <TextField
                              value={editedProducts[cell.column.id]}
                              onChange={(e) =>
                                setEditedProducts({
                                  ...editedProducts,
                                  [cell.column.id]: e.target.value,
                                })
                              }
                            />
                          ) : (
                            cell.render('Cell')
                          )
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
            name="productName"
            margin='normal'
                required
                fullWidth
                id="productName"
                placeholder="XYZ"
          />
          <TextField
            label="Market Price"
            value={newProduct.marketPrice}
            onChange={(e) => setNewProduct({ ...newProduct, marketPrice: e.target.value })}
            name="marketPrice"
            margin='normal'
                required
                fullWidth
                id="marketPrice"
                placeholder="000"
          />
         <TextField
            label="Original Price"
            value={newProduct.originalPrice}
            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
            name="originalPrice"
            margin='normal'
                required
                fullWidth
                id="originalPrice"
                placeholder="000"
          />
          <TextField
            label="Image"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            name="image"
            margin='normal'
                required
                fullWidth
                id="image"
                placeholder="Url"
          />
          <TextField
            label="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            name="quantity"
            margin='normal'
                required
                fullWidth
                id="quantity"
                placeholder="000"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="info">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} variant='contained'>
            Add
          </Button>
        </DialogActions>
      </Dialog>

        <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};  
export default AllProducts;
