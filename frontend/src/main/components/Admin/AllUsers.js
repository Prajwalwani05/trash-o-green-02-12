import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useRowSelect, useSortBy } from 'react-table';
import { Box, Button, Typography, CircularProgress, TextField, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
  const [userToDelete, setUserToDelete] = useState(null); // To store user id for deletion
  const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message to show in snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severity of the snackbar (success or error)
  const [openAddDialog, setOpenAddDialog] = useState(false); // For opening/closing add dialog
  const [newUser, setNewUser] = useState({ name: '', email: '', mobile: '', role: 'User', password: '' }); // New user state
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${REACT_APP_API_URL}/api/users/getAllUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let isValid = true;
  
      if (!newUser.email || !/\S+@\S+\.\S+/.test(newUser.email)) {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid email address.');
        isValid = false;
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }
      if (!newUser.mobile || newUser.mobile.length !== 10 || isNaN(newUser.mobile)) {
        setMobileError(true);
        setMobileErrorMessage('Mobile number must be exactly 10 digits long and contain only numbers.');
        isValid = false;
      } else {
        setMobileError(false);
        setMobileErrorMessage('');
      }
      if (!newUser.password || newUser.password.length < 6) {
        setPasswordError(true);
        setPasswordErrorMessage('Password must be at least 6 characters long.');
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }

      if (newUser.mobile.length > 10) {
        setMobileError(true);
        setMobileErrorMessage('Mobile number length should be 10.');
        isValid = false;
      } else {
        setMobileError(false);
        setMobileErrorMessage('');
      }
  
      if (!newUser.name || newUser.name.length < 1) {
        setNameError(true);
        setNameErrorMessage('Name is required.');
        isValid = false;
      } else {
        setNameError(false);
        setNameErrorMessage('');
      }

      if(isValid){
        const response = await axios.post(`${REACT_APP_API_URL}/api/users/addUser`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers([...users, response.data]); // Add new user to the state
        setOpenAddDialog(false); // Close add user dialog
        setSnackbarMessage('User added successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setNewUser({ name: '', email: '', mobile: '', role: 'User', password: '' }); // Reset the form
      }  
    }
    catch (err) {
     setOpenAddDialog(false);
     setSnackbarMessage('Error adding user');
     setSnackbarSeverity('error');
     setOpenSnackbar(true);
   }
  };


  const handleEdit = (user) => {
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setEditedUser(null);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(
        `${REACT_APP_API_URL}/api/users/saveUser/${editedUser.id}`,
        editedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUsers = users.map((user) =>
        user.id === editedUser.id ? response.data : user
      );
      setUsers(updatedUsers);
      setSnackbarMessage('User updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true); // Show success snackbar
      setEditedUser(null);
    } catch (err) {
      setSnackbarMessage('Error updating user');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); // Show error snackbar
    }
  };
  const handleDelete = (id) => {
    setUserToDelete(id); // Store the user id to delete
    setOpenDialog(true);  // Open the confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${REACT_APP_API_URL}/api/users/deleteUser/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userToDelete)); // Remove the user from the state
      setSnackbarMessage('User deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true); // Show success snackbar
      setOpenDialog(false); // Close the dialog
    } catch (err) {
      setSnackbarMessage('Error deleting user');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); // Show error snackbar
      setOpenDialog(false); // Close the dialog
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
      { Header: 'Role', accessor: 'role' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Mobile', accessor: 'mobile' },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          const user = row.original;
          return (
            <Box sx={{display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}>
              {editedUser?.id === user.id ? (
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
    [editedUser, users]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data: users, initialState: { selectedRowIds: {} } },
    useSortBy,
    useRowSelect
  );
  
  // Loading and error states
  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;
  
  return (
    <Box mt={0} p={2} style={{ height: '100%', width: '100%'}}>
      <Typography style={{textAlign:'center'}} mb={2} variant="h5">All Users</Typography>
      <Button startIcon={<AddCircleIcon />} variant="text" color="secondary" onClick={() => setOpenAddDialog(true)}>
        Add User
      </Button>
      <Box sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px" }}>
        <div style={{ overflowX: 'auto' }}>
        <table className='adminTable' {...getTableProps()}>
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
                <tr style={{
                  backgroundColor:
                    row.original.role === 'user'
                      ? '#ade8f4' // Light red for Pending
                      : row.original.role === 'Admin'
                      ? '#f9c784' // Light green for Completed
                      : row.original.role === 'Trashman'
                      ? '#d4edda' // Light yellow for InProgress
                      : '', // Default no color
                }} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const isEditable = editedUser?.id === row.original.id;
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: '10px',
                          textAlign: 'left',
                          border: '1px solid #eaf4f4',
                        }}
                      >
                        {cell.column.id === 'role' ? (
                          isEditable ? (
                            <Select
                            value={editedUser.role}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                role: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Trashman">Trashman</MenuItem>
                          </Select>
                          ) : (
                            cell.render('Cell')
                          )
                        ) : cell.column.id === 'name' ||
                          cell.column.id === 'email' ||
                          cell.column.id === 'mobile' ? (
                          isEditable ? (
                            <TextField
                              value={editedUser[cell.column.id]}
                              onChange={(e) =>
                                setEditedUser({
                                  ...editedUser,
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
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            name="name"
            margin='normal'
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            margin='normal'
            id="email"
                placeholder="your@email.com"
            name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? 'error' : 'primary'}
          />
          <TextField
            label="Mobile"
            value={newUser.mobile}
            onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
            fullWidth
            id="mobile"
            margin='normal'
                placeholder="0123456789"
                name="mobile"
                autoComplete="mobile"
                variant="outlined"
                error={mobileError}
                helperText={mobileErrorMessage}
                color={mobileError ? 'error' : 'primary'}
          />
          <TextField
            label="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            fullWidth
            name="password"
            margin='normal'
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
          />
          <FormControl fullWidth margin="normal">
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Trashman">Trashman</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="info">
            Cancel
          </Button>
          <Button onClick={handleAddUser} variant='contained'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
        
        <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
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
export default AllUsers;
