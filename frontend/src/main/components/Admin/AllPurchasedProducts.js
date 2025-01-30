import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTable, useRowSelect, useSortBy } from "react-table";
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
  styled,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const AllPurchasedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedProducts, setEditedProducts] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
  const [productsToDelete, setProductsToDelete] = useState(null); // To store user id for deletion
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to show in snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity of the snackbar (success or error)
  const [openAddDialog, setOpenAddDialog] = useState(false); // For opening/closing add dialog
  const [newProduct, setNewProduct] = useState({
    productName: "",
    marketPrice: "",
    originalPrice: "",
    image: "",
    quantity: "",
  }); // New user state
  // Fetch users from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${REACT_APP_API_URL}/api/purchasedProduct/getAllPurchasedProducts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (user) => {
    setEditedProducts({ ...user });
  };

  const handleCancel = () => {
    setEditedProducts(null);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      // Prepare the data to be sent, including the document if it's updated
      // Convert file to base64 if document is present
      let updatedData = { ...editedProducts };
      const response = await axios.put(
        `${REACT_APP_API_URL}/api/purchasedProduct/updatePurchasedProduct/${editedProducts.id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUsers = products.map((user) =>
        user.id === editedProducts.id ? response.data : user
      );
      setProducts(updatedUsers);
      setSnackbarMessage("Products updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Show success snackbar
      setEditedProducts(null);
    } catch (err) {
      setSnackbarMessage("Error updating products");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); // Show error snackbar
    }
  };
  const handleDelete = (id) => {
    setProductsToDelete(id); // Store the user id to delete
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleDeleteConfirm = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `${REACT_APP_API_URL}/api/purchasedProduct/deletePurchasedProduct/${productsToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((user) => user.id !== setProductsToDelete));
      setSnackbarMessage("Product delete successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Show success snackbar
      setOpenDialog(false);
    } catch (err) {
      setSnackbarMessage("Error deleting product");
      setSnackbarSeverity("error");
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
      { Header: "ID", accessor: "id" },
      { Header: "User Id", accessor: "userId" },
      { Header: "User Name", accessor: "userName" },
      { Header: "User Mobile", accessor: "userMobile" },
      { Header: "Product Name", accessor: "productName" },
      { Header: "Original Price", accessor: "originalPrice" },
      { Header: "Buying Price", accessor: "buyingPrice" },
      { Header: "Quantity", accessor: "quantity" },
      { Header: "Amount", accessor: "amount" },
      { Header: "Payment Status", accessor: "paymentStatus" },
      { Header: "Order Status", accessor: "orderStatus" },
      { Header: "Area", accessor: "area" },
      { Header: "Address", accessor: "address" },

      {
        Header: "Actions",
        Cell: ({ row }) => {
          const user = row.original;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                justifyContent: "center",
              }}
            >
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
                    style={{ marginLeft: "10px" }}
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
                    style={{ marginRight: "5px" }}
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
  if (error)
    return (
      <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
    );

  return (
    <Box mt={0} p={2} style={{ height: "100%", width: "100%" }}>
      <Typography style={{ textAlign: "center" }} mb={2} variant="h5">
        All Purchased Products
      </Typography>
      <Box
        sx={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        }}
      >
        <div style={{ overflowX: "auto", padding: "0" }}>
          <table className="adminTable" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
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
                      row.original.paymentStatus === "Paid" && row.original.orderStatus === "Completed"
                        ? "#d4edda"
                        : "#fff2b2"
                  }}
                  {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      const isEditable = editedProducts?.id === row.original.id;
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            border: "1px solid #eaf4f4",
                          }}
                        >
                          {cell.column.id === "paymentStatus" ? (
                            isEditable ? (
                              <Select
                                value={editedProducts.paymentStatus || ""}
                                onChange={(e) =>
                                  setEditedProducts({
                                    ...editedProducts,
                                    paymentStatus: e.target.value,
                                  })
                                }
                              >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Not Paid">Not Paid</MenuItem>
                              </Select>
                            ) : (
                              cell.render("Cell")
                            )
                          ) :
                          cell.column.id === "orderStatus" ? (
                            isEditable ? (
                              <Select
                                value={editedProducts.orderStatus || ""}
                                onChange={(e) =>
                                  setEditedProducts({
                                    ...editedProducts,
                                    orderStatus: e.target.value,
                                  })
                                }
                              >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                              </Select>
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
export default AllPurchasedProducts;
