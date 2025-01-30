// routes/bookingRoutes.js
const express = require('express');
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productsController');
const { sequelize2 } = require('../db/dbConnection');
const router = express.Router();

//router.post('/create', createBooking);
// router.get('/all', getProducts);
//router.put('/cancelBooking/:id', cancelBooking)
// Admin
router.get('/getAllProducts', getAllProducts);
router.post('/addProduct', addProduct);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);


// router.get('/call-procedure-mskvy', async (req, res) => {
//     try {
//         var results  = await sequelize2.query('CALL ALL_ClustrBase_LOA_Details()');
//         res.json(results);
//         console.log(results)
//       } catch (error) {
//         console.error('Error calling procedure in DB1:', error);
//         res.status(500).send('Error calling procedure in DB1');
//       }
// })

// router.get("/api/district-summary", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://pmuportal.mahadiscom.in/api/DistrictWiseSummary/GetAllDistrictSummary"
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });

// router.post("/cluster-summary", (req, res) => {
//   const {
//     clusterSummeryID,
//     District_Name,
//     Cluster_Name,
//     RFS_Number,
//     Date_OF_RFS,
//     Bid_Submission_Date,
//     SPVName,
//     Scheduled_LOI_Issuance_Date,
//     Actual_LOI_Issuance_Date,
//     Status,
//     Comments,
//     CreatedBy,
//     ModifiedBy,
//   } = req.body;

//   const query = `
//     CALL InsertUpdateClusterSummery(
//       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
//     );
//   `;

//   connection.execute(
//     query,
//     [
//       clusterSummeryID,
//       District_Name,
//       Cluster_Name,
//       RFS_Number,
//       Date_OF_RFS,
//       Bid_Submission_Date,
//       SPVName,
//       Scheduled_LOI_Issuance_Date,
//       Actual_LOI_Issuance_Date,
//       Status,
//       Comments,
//       "Reference_No_Of_RfS", // Example
//       "Date_of_Issuance_Rfs", // Example
//       "RfS_Corrigendum_Addendum_No", // Example
//       "Date_Issuance_RfS_Corrigendum", // Example
//       "RfS_Clarification_No", // Example
//       "Date_RfS_Clarification", // Example
//       "Name_Hosting_Platform", // Example
//       "Date_intimation_Mail_MSAPL", // Example
//       "Start_e_Reverse_Auction", // Example
//       "End_e_Reverse_Auction", // Example
//       "Bank_Guarantee_No", // Example
//       "Date_Issuance_Bank_Guarantee", // Example
//       "Bank_Guarantee_Amount_in_Words", // Example
//       "Bank_Guarantee_Amount_in_Numbers", // Example
//       "Selected_BidderAuthPersonName", // Example
//       "name_of_the_Selected_Bidder_Company", // Example
//       "address_of_the_Selected_Bidder", // Example
//       "MSAPL_office_on", // Example
//       "tariff_discovered", // Example
//       "Start_e_Reverse_Auction_hrs", // Example
//       "End_e_Reverse_Auction_hrs", // Example
//       "Bidder_ContactNo", // Example
//       "Bidder_EmailID", // Example
//       "Bidder_MobileNo", // Example
//       "IsE_Reverse_Or_DirectAward", // Example
//       CreatedBy,
//       ModifiedBy,
//     ],
//     (err, results) => {
//       if (err) {
//         console.error("Error executing stored procedure:", err);
//         return res.status(500).send("An error occurred");
//       }
//       console.log("Procedure executed successfully:", results);
//       res.status(200).json(results);
//     }
//   );
// });


module.exports = router;
