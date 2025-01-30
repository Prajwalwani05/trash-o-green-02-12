// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useTable, useRowSelect, useSortBy } from 'react-table';
// import { Box, Button, Typography, CircularProgress, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, styled } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// const AllTrashmen = () => {
//   const [trashmen, setTrashmen] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editedUser, setEditedUser] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
//   const [trashmanToDelete, setTrashmanToDelete] = useState(null); // To store user id for deletion
//   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
//   const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
//   const [snackbarMessage, setSnackbarMessage] = useState(''); // Message to show in snackbar
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severity of the snackbar (success or error)

//   // Fetch users from the API
//   useEffect(() => {
//     const fetchTrashmen = async () => {
//       try {
//         const token = sessionStorage.getItem('token');
//         const response = await axios.get(`${REACT_APP_API_URL}/api/trashmen/getAllTrashmen`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(response.data)
//         setTrashmen(response.data);
//       } catch (err) {
//         setError('Error fetching trashmen');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrashmen();
//   }, []);

  
//   const handleEdit = (user) => {
//     setEditedUser({ ...user });
//   };

//   const handleCancel = () => {
//     setEditedUser(null);
//   };

//   const convertFileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };
//   const handleSave = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
      
//           // Prepare the data to be sent, including the document if it's updated
//      // Convert file to base64 if document is present
//      let updatedData = { ...editedUser };
//      if (editedUser.document) {
//        const base64Document = await convertFileToBase64(editedUser.document);
//        updatedData.document = base64Document; // Attach base64 encoded document
//      }
//      else{
//       setSnackbarMessage('No file selected');
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true);
//       return;
//      }
     
//       const response = await axios.put(
//         `${REACT_APP_API_URL}/api/trashmen/updateTrashmen/${editedUser.id}`,
//         updatedData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const updatedUsers = trashmen.map((user) =>
//         user.id === editedUser.id ? response.data : user
//       );
//       setTrashmen(updatedUsers);
//       setSnackbarMessage('Trashman updated successfully!');
//       setSnackbarSeverity('success');
//       setOpenSnackbar(true); // Show success snackbar
//       setEditedUser(null);
//     } catch (err) {
//       setSnackbarMessage('Error updating trashman');
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true); // Show error snackbar
//     }
//   };
//   const handleDelete = (id) => {
//     setTrashmanToDelete(id); // Store the user id to delete
//     setOpenDialog(true);  // Open the confirmation dialog
//   };

//   const handleDeleteConfirm = async (id) => {
//     try {
//       const token = sessionStorage.getItem('token');
//       await axios.delete(`${REACT_APP_API_URL}/api/trashmen/deleteTrashmen/${trashmanToDelete}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTrashmen(trashmen.filter((user) => user.id !== setTrashmanToDelete));
//       setSnackbarMessage('Trashman updated successfully!');
//       setSnackbarSeverity('success');
//       setOpenSnackbar(true); // Show success snackbar
//       setOpenDialog(false);
//     } catch (err) {
//       setSnackbarMessage('Error deleting trashman');
//       setSnackbarSeverity('error');
//       setOpenDialog(false);
//     }
//   };
//   const handleDeleteCancel = () => {
//     setOpenDialog(false); // Close the dialog without deleting
//   };

//   const handleSnackbarClose = () => {
//     setOpenSnackbar(false); // Close snackbar
//   };
//   // Column definitions
//   const columns = React.useMemo(
//     () => [
//       { Header: "Role", accessor: "role" },
//       { Header: "trashmanNumber", accessor: "trashmanNumber" },
//       { Header: "trashmanId", accessor: "trashmanId" },
//       { Header: "Name", accessor: "name" },
//       { Header: "Mobile", accessor: "mobile" },
//       { Header: "Area", accessor: "area" },
//       { Header: "Address", accessor: "address" },
//       { Header: "Status", accessor: "status" },
//       { Header: "document", accessor: "document" },
//       {
//         Header: 'Actions',
//         Cell: ({ row }) => {
//           const user = row.original;
//           return (
//             <Box sx={{display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}>
//               {editedUser?.id === user.id ? (
//                 <>
//                   <Button
//                     onClick={handleSave}
//                     variant="outlined"
//                     startIcon={<SaveIcon />}
//                     size="small"
//                   >
//                     Save
//                   </Button>
//                   <Button
//                     onClick={handleCancel}
//                     variant="outlined"
//                     startIcon={<CancelIcon />}
//                     size="small"
//                     style={{ marginLeft: '10px' }}
//                   >
//                     Cancel
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     onClick={() => handleEdit(user)}
//                     variant="outlined"
//                     startIcon={<EditIcon />}
//                     size="small"
//                     style={{ marginRight: '5px' }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     onClick={() => handleDelete(user.id)}
//                     variant="outlined"
//                     startIcon={<DeleteIcon />}
//                     size="small"
//                   >
//                     Delete
//                   </Button>
//                 </>
//               )}
//             </Box>
//           );
//         },
//       },
//     ],
//     [editedUser, trashmen]
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     state: { selectedRowIds },
//   } = useTable(
//     { columns, data: trashmen, initialState: { selectedRowIds: {} } },
//     useSortBy,
//     useRowSelect
//   );
  
//   // Loading and error states
//   if (loading) return <CircularProgress />;
//   if (error) return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;
//   const VisuallyHiddenInput = styled('input')({
//     clip: 'rect(0 0 0 0)',
//     clipPath: 'inset(50%)',
//     height: 1,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     whiteSpace: 'nowrap',
//     width: 1,
//   });
//   const handleFileChange = (e) => {
//     // File input returns an array of files
//     const file = e.target.files[0]; // Get the first file
//     setEditedUser({
//       ...editedUser,
//       document: file,  // Store the file in state
//     });
//   };
//   return (
//     <Box mt={0} p={2} style={{ height: '100%', width: '100%' }}>
//       <Typography style={{textAlign:'center'}} mb={2} variant="h5">All Trashmen</Typography>
//       <Box sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px" }}>
//         <div style={{ overflowX: 'auto' }}>
//         <table className='adminTable' {...getTableProps()} >
//           <thead>
//             {headerGroups.map((headerGroup) => (
//               <tr {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map((column) => (
//                   <th {...column.getHeaderProps()} style={{ padding: '10px', textAlign: 'left', backgroundColor:'#023e7d', color:'#FFFFFF' }}>
//                     {column.render('Header')}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {rows.map((row) => {
//               prepareRow(row);
//               return (
//                 <tr 
//                 style={{
//                   backgroundColor:
//                     row.original.status === 'Active'
//                       ? '#d4edda' // Light red for Pending
//                       : row.original.status === 'Inactive'
//                       ? '#ffcccb' // Light green for Completed
//                       : '', // Default no color
//                 }}
//                 {...row.getRowProps()}>
//                   {row.cells.map((cell) => {
//                     const isEditable = editedUser?.id === row.original.id;
//                     return (
//                       <td
//                         {...cell.getCellProps()}
//                         style={{
//                           padding: '10px',
//                           textAlign: 'left',
//                           border: '1px solid #eaf4f4',
//                         }}
//                       >
//                         {
                        
//                           cell.column.id === 'status' ? (
//                             isEditable ? (
//                               <Select
//                               value={editedUser.status}
//                               onChange={(e) =>
//                                 setEditedUser({
//                                   ...editedUser,
//                                   status: e.target.value,
//                                 })
//                               }
//                             >
//                                 <MenuItem  value="Active">Active</MenuItem>
//                                 <MenuItem  value="Inactive">Inactive</MenuItem>
//                             </Select>
//                             ) : (
//                               cell.render('Cell')
//                             )
//                           ) : 
//                           cell.column.id === 'document' ? (
//                             isEditable ? (
//                               <Button
//                                 component="label"
//                                 variant="outlined"
//                                 startIcon={<CloudUploadIcon />}
//                                 size="small"
//                               >
//                                 Upload
//                                 <VisuallyHiddenInput
//                                   type="file"
//                                   onChange={handleFileChange}
//                                   multiple
//                                 />
//                               </Button>
//                             ) :
//                             (
//                               // If document exists, show the document info (e.g., filename or a link)
//                               row.original.document ? (
//                                 <Typography variant="body2">{row.original.document.name || 'No document uploaded'}</Typography>
//                               ) : (
//                                 <Typography variant="body2" color="textSecondary">No document available</Typography>
//                               )
//                             )
//                             )
//                            : (
//                           cell.render('Cell')
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//         </div>
//         <Dialog open={openDialog} onClose={handleDeleteCancel}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this trashman?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDeleteCancel} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="secondary">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       </Box>
//     </Box>
//   );
// };  
// export default AllTrashmen;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRowSelect, useSortBy, useTable } from "react-table";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import PdfViewer from "./pdfViewer";
import { Eye, Link } from "@phosphor-icons/react";

const AllTrashman = () => {
  const [allTrashman, setAllTrashman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedTrashman, setEditedTrashman] = useState(null);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
  const [trashmanToDelete, setTrashmanToDelete] = useState(null); // To store user id for deletion
  const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to show in snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity of the snackbar (success or error)
  // const [trashmen, setTrashmen] = useState('');
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${REACT_APP_API_URL}/api/trashmen/getAllTrashmen`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        if(response.data){
          setAllTrashman(response.data);
        }
      } catch (err) {
        setError("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle Edit
  const handleEdit = (booking) => {
    setEditedTrashman({ ...booking });
  };

  // Handle Cancel
  const handleCancel = () => {
    setEditedTrashman(null);
  };
  // Handle Save
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${REACT_APP_API_URL}/api/trashmen/updateTrashmen/${editedTrashman.id}`,
        editedTrashman,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedBookings = allTrashman.map((booking) =>
        booking.id === editedTrashman.id ? response.data : booking
      );
      setAllTrashman(updatedBookings);
      setSnackbarMessage("Booking updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Show success snackbar
      setEditedTrashman(null);
    } catch (err) {
      setSnackbarMessage("Error updating booking");
      setSnackbarSeverity("error", err);
      setOpenSnackbar(true); // Show error snackbar
    }
  };

  const handleDelete = (id) => {
    setTrashmanToDelete(id); // Store the user id to delete
    setOpenDialog(true); // Open the confirmation dialog
  };
  // Handle Delete
  const handleDeleteConfirm = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `${REACT_APP_API_URL}/api/trashmen/deleteTrashmen/${trashmanToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllTrashman(
        allTrashman.filter((booking) => booking.id !== trashmanToDelete)
      );
      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Show success snackbar
      setOpenDialog(false); // Close the dialog
    } catch (err) {
      setSnackbarMessage("Error deleting user");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); // Show error snackbar
      setOpenDialog(false);
    }
  };
  const handleDeleteCancel = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close snackbar
  };
  // Function to open PDF viewer modal
  const handleViewPdf = (url) => {
    console.log(url)
    setPdfUrl(url);
    setOpenPdfViewer(true);
  };
  // Column definitions for react-table
  const columns = React.useMemo(
    () => [
      { Header: "Role", accessor: "role" },
      { Header: "trashmanNumber", accessor: "trashmanNumber" },
      { Header: "trashmanId", accessor: "trashmanId" },
      { Header: "Name", accessor: "name" },
      { Header: "Mobile", accessor: "mobile" },
      { Header: "Area", accessor: "area" },
      { Header: "Address", accessor: "address" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Document",
        accessor: "document",
        Cell: ({ row }) => {
          const documentUrl = row.original.document;
          return documentUrl ? (
            <Box display={'flex'} gap={'5px'} justifyContent={'center'}>
              <Button 
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleViewPdf(documentUrl)}
              >
                <Eye size={25} weight="bold" />
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => window.open(documentUrl, "_blank")}
              >
                <Link size={25} weight="bold" />
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No Document
            </Typography>
          );
        },
      },
      { Header: "Booked On", accessor: "createdAt" },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          const booking = row.original;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                justifyContent: "center",
              }}
            >
              {editedTrashman?.id !== booking.id ? (
                <>
                  <Button
                    onClick={handleSave}
                    variant="outlined"
                    color="warning"
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
                    // style={{ marginLeft: '10px' }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleEdit(booking)}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(booking.id)}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
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
    [editedTrashman, allTrashman]
  );

  // Initialize react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data: allTrashman, initialState: { selectedRowIds: {} } },
    useSortBy,
    useRowSelect
  );

  // Loading and error states
  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
    );

  return (
    <Box
      mt={9}
      p={2}
      style={{ height: "100%", width: "100%", overflowX: "auto" }}
    >
      <Typography style={{ textAlign: "center" }} mb={2} variant="h5">
        All Trashmen
      </Typography>
      <Box
        sx={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="adminTable" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  style={{ border: "1px solid" }}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        backgroundColor: "#023e7d",
                        color: "#FFFFFF",
                      }}
                    >
                      {column.render("Header")}
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
                    style={{
                      backgroundColor:
                        row.original.status === "Approval Pending"
                          ? "#f4f3ee" // Light red for Pending
                          : row.original.status === "Completed"
                          ? "#d4edda" // Light green for Completed
                          : row.original.status === "InProgress"
                          ? "#fff2b2" // Light yellow for InProgress
                          : row.original.status === "Cancelled"
                          ? "#ffcccb" // Light yellow for InProgress
                          : "", // Default no color
                    }}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      const isEditable = editedTrashman && editedTrashman?.id === row.original.id;
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "5px",
                            textAlign: "left",
                            border: "1px solid #eaf4f4",
                          }}
                        >
                          {cell.column.id === "status" ? (
                            isEditable ? (
                              <Select
                                value={editedTrashman.status || ''}
                                onChange={(e) =>
                                  setEditedTrashman({
                                    ...editedTrashman,
                                    status: e.target.value,
                                  })
                                }
                              >
                                <MenuItem value="Approval Pending">
                                  Approval Pending
                                </MenuItem>
                                <MenuItem value="InProgress">
                                  InProgress
                                </MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                              </Select>
                            ) : (
                              cell.render("Cell")
                            )
                          ) : cell.column.id === "pickUpDate" ? (
                            isEditable ? (
                              <TextField
                                type="date"
                                value={editedTrashman[cell.column.id] || ''}
                                onChange={(e) =>
                                  setEditedTrashman({
                                    ...editedTrashman,
                                    [cell.column.id]: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              cell.render("Cell")
                            )
                          ) : cell.column.id === "area" ? (
                            isEditable ? (
                              <Select
                                value={editedTrashman.area || ''}
                                onChange={(e) =>
                                  setEditedTrashman({
                                    ...editedTrashman,
                                    area: e.target.value,
                                  })
                                }
                              >
                                <MenuItem value="Kothrud">Kothrud</MenuItem>
                                <MenuItem value="Karve Nagar">
                                  Karve Nagar
                                </MenuItem>
                                <MenuItem value="Warje">Warje</MenuItem>
                                <MenuItem value="Shivane">Shivane</MenuItem>
                              </Select>
                            ) : (
                              cell.render("Cell")
                            )
                          )  : cell.column.id === "mobile" ||
                            cell.column.id === "address" ? (
                            // cell.column.id === 'assignedTrashman'
                            isEditable ? (
                              <TextField
                                value={editedTrashman[cell.column.id] || ''}
                                onChange={(e) =>
                                  setEditedTrashman({
                                    ...editedTrashman,
                                    [cell.column.id]: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              cell.render("Cell")
                            )
                          ) : (
                            cell.render("Cell")
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
        <Dialog open={openDialog} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this booking?
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
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      <Dialog sx={{}} open={openPdfViewer} onClose={() => setOpenPdfViewer(false)} fullWidth maxWidth="md">
        <DialogTitle>View Document</DialogTitle>
        <DialogContent dividers>
          {pdfUrl ? (
            <PdfViewer pdfUrl={pdfUrl}/>
          ) : (
            <Typography>No document found</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPdfViewer(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllTrashman;
