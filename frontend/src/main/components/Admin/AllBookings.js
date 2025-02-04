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

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedBooking, setEditedBooking] = useState(null);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
  const [bookingToDelete, setBookingToDelete] = useState(null); // To store user id for deletion
  const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to show in snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity of the snackbar (success or error)
  const [trashmen, setTrashmen] = useState('');
  // Fetch users from the API
  useEffect(() => {
    const fetchTrashmen = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${REACT_APP_API_URL}/api/trashmen/getAllTrashmen`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrashmen(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchTrashmen();
  }, [REACT_APP_API_URL]);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${REACT_APP_API_URL}/api/bookings/getAllBookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        if(response.data){
          setAllBookings(response.data);
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
    setEditedBooking({ ...booking });
  };

  // Handle Cancel
  const handleCancel = () => {
    setEditedBooking(null);
  };
  // Handle Save
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${REACT_APP_API_URL}/api/bookings/updateBookings/${editedBooking.id}`,
        editedBooking,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedBookings = allBookings.map((booking) =>
        booking.id === editedBooking.id ? response.data : booking
      );
      setAllBookings(updatedBookings);
      setSnackbarMessage("Booking updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Show success snackbar
      setEditedBooking(null);
    } catch (err) {
      setSnackbarMessage("Error updating booking");
      setSnackbarSeverity("error", err);
      setOpenSnackbar(true); // Show error snackbar
    }
  };

  const handleDelete = (id) => {
    setBookingToDelete(id); // Store the user id to delete
    setOpenDialog(true); // Open the confirmation dialog
  };
  // Handle Delete
  const handleDeleteConfirm = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `${REACT_APP_API_URL}/api/bookings/deleteBookings/${bookingToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllBookings(
        allBookings.filter((booking) => booking.id !== bookingToDelete)
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
  // Column definitions for react-table
  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "User Id", accessor: "userId" },
      { Header: "Name", accessor: "name" },
      { Header: "Mobile", accessor: "mobile" },
      { Header: "Area", accessor: "area" },
      { Header: "Address", accessor: "address" },
      { Header: "Trash Type", accessor: "trashtype" },
      { Header: "Calculated Weight", accessor: "calculatedWeight" },
      { Header: "Assigned Trashman", accessor: "assignedTrashman" },
      { Header: "Trashman Id", accessor: "trashmanId" },
      { Header: "Pick Up Date", accessor: "pickUpDate" },
      { Header: "Payment Status", accessor: "paymentStatus" },
      { Header: "Status", accessor: "status" },
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
              {editedBooking?.id === booking.id ? (
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
    [editedBooking, allBookings]
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
    { columns, data: allBookings, initialState: { selectedRowIds: {} } },
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
      p={2}
      pt={12}
      style={{ height: "100%", width: "100%", overflowX: "auto" }}
    >
      <Typography style={{ textAlign: "center" }} mb={2} variant="h5">
        All Bookings
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
                      const isEditable = editedBooking && editedBooking?.id === row.original.id;
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
                                value={editedBooking.status || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
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
                          ) 
                          :
                          cell.column.id === "paymentStatus" ? (
                            isEditable ? (
                              <Select
                                value={editedBooking.paymentStatus || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
                                    paymentStatus: e.target.value,
                                  })
                                }
                              >
                                <MenuItem value="Paid">
                                  Paid
                                </MenuItem>
                                <MenuItem value="Not Paid">
                                  Not Paid
                                </MenuItem>
                              </Select>
                            ) : (
                              cell.render("Cell")
                            )
                          )
                          : cell.column.id === "pickUpDate" ? (
                            isEditable ? (
                              <TextField
                                type="date"
                                value={editedBooking[cell.column.id] || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
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
                                value={editedBooking.area || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
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
                          ) : cell.column.id === "assignedTrashman" ? (
                            isEditable ? (
                              <Select
                                value={editedBooking.assignedTrashman || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
                                    assignedTrashman: e.target.value,
                                  })
                                }
                              >
                                {trashmen
                                  .map((man) => (
                                    <MenuItem key={man.name} value={man.name}>
                                      {man.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )
                            
                            : (
                              cell.render("Cell")
                            )
                          )
                          : cell.column.id === "trashmanId" ? (
                            isEditable ? (
                              <Select
                                value={editedBooking.trashmanId || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
                                    trashmanId: e.target.value,
                                  })
                                }
                              >
                                {trashmen
                                  .map((man) => (
                                    <MenuItem key={man.trashmanId} value={man.trashmanId}>
                                      {man.trashmanId}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )
                            
                            : (
                              cell.render("Cell")
                            )
                          )
                          : cell.column.id === "mobile" ||
                            cell.column.id === "address" ? (
                            // cell.column.id === 'assignedTrashman'
                            isEditable ? (
                              <TextField
                                value={editedBooking[cell.column.id] || ''}
                                onChange={(e) =>
                                  setEditedBooking({
                                    ...editedBooking,
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
    </Box>
  );
};

export default AllBookings;
