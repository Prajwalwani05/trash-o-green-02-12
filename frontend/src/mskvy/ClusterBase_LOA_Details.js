// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { Box, Divider, Typography } from '@mui/material';

// // function ProcedureResults() {
// //   const [products, setProducts] = useState([]); // To store results from the stored procedure
// //   const [loading, setLoading] = useState(true); // For loading state
// //   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// //   useEffect(() => {
// //     // Fetch the results from the backend when the component mounts
// //     axios
// //       .get(`${REACT_APP_API_URL}/api/products/call-procedure-mskvy`) // Make sure to match the route
// //       .then((response) => {
// //         setProducts(response.data); // Store the results in state
// //         console.log(response.data)
// //         setLoading(false); // Stop loading once data is received
// //       })
// //       .catch((error) => {
// //         console.error('Error fetching procedure results:', error);
// //         setLoading(false); // Stop loading on error
// //       });
// //   }, []); // Empty dependency array, so it runs once on mount


// //   if (loading) {
// //     return <div>Loading...</div>; // Display loading message while fetching data
// //   }

// //   return (
// //     <Box py={12} mx={3} >
// //       <h2>Clusterbase LOA Details</h2>
// //       {products && products.length > 0 ? (
// //         <ul>
// //           {products.map((product, index) => (
// //             <li key={index}>
// //               <Typography> Ref No. = {product.Reference_No_Of_RfS}</Typography>            
// //               <Typography> Bid Submission Date = {product.Bid_Submission_Date}</Typography>
// //               <Typography> Date of Issuance = {product.Date_of_Issuance_Rfs}</Typography> 
// //               <Typography> Data of LOA Issuance = {product.Date_of_LOA_issuance}</Typography>
// //               <Typography> LOA Ref. No. = {product.LOA_Reference_No}</Typography>
// //               <Typography> Project Solar Capacity (MW) = {product.Project_Solar_Capacity_MW}</Typography>
// //             <Divider />
// //             </li>
// //           ))}
// //         </ul>
// //       ) : (
// //         <p>No data available</p>
// //       )}
// //     </Box>
// //   );
// // }

// // export default ProcedureResults;
// import { Box } from "@mui/material";
// import React, { useState } from "react";

// function ClusterSummaryForm() {
//   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
//   const [formData, setFormData] = useState({
//     clusterSummeryID: 0, // 0 means inserting a new record
//     District_Name: "",
//     Cluster_Name: "",
//     RFS_Number: "",
//     Date_OF_RFS: "",
//     Bid_Submission_Date: "",
//     SPVName: "",
//     Scheduled_LOI_Issuance_Date: "",
//     Actual_LOI_Issuance_Date: "",
//     Status: "",
//     Comments: "",
//     CreatedBy: 1, // Example user ID
//     ModifiedBy: 1, // Example user ID
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`${REACT_APP_API_URL}/api/products/cluster-summary`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       console.log("Response from backend:", result);
//       if (response.ok) {
//         alert("Cluster summary submitted successfully!");
//       } else {
//         alert("Error submitting cluster summary");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred");
//     }
//   };

//   return (
//     <Box mt={14}>
//     <form  onSubmit={handleSubmit}>
//       <div>
//         <label>District Name:</label>
//         <input
//           type="text"
//           name="District_Name"
//           value={formData.District_Name}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Cluster Name:</label>
//         <input
//           type="text"
//           name="Cluster_Name"
//           value={formData.Cluster_Name}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>RFS Number:</label>
//         <input
//           type="text"
//           name="RFS_Number"
//           value={formData.RFS_Number}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Date of RFS:</label>
//         <input
//           type="datetime-local"
//           name="Date_OF_RFS"
//           value={formData.Date_OF_RFS}
//           onChange={handleChange}
//         />
//       </div>
//       {/* Add other fields similarly */}
//       <button type="submit">Submit</button>
//     </form>
//     </Box>
//   );
// }

// export default ClusterSummaryForm;
