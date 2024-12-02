// import React, { useState } from 'react';

// const RequestForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     mobile: '',
//     notes: '',
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/submit-request', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setSubmitted(true);
//       } else {
//         alert('Failed to submit request.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   if (submitted) {
//     return <h2>Thank you! Your request has been submitted.</h2>;
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h1>Book Trash Pickup</h1>
//       <div>
//         <label>Name:</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Address:</label>
//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           required
//         ></textarea>
//       </div>
//       <div>
//         <label>Mobile Number:</label>
//         <input
//           type="tel"
//           name="mobile"
//           value={formData.mobile}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Notes (optional):</label>
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//         ></textarea>
//       </div>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default RequestForm;
