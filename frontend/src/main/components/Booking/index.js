// import { Box, Button, FormControl, FormLabel, TextField, Typography, Select, MenuItem, Card, styled, Chip, Container, CardContent, CardActionArea, List, ListItem, ListItemIcon, ListItemText, OutlinedInput, Checkbox } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Use the named import
// import TransitionsModal from './Modal';
// import warning from '../assets/warning.png';
// import confirm from '../assets/confirm.gif';
// import { DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs'; // Optional for date manipulation
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import RecyclingIcon from '@mui/icons-material/Recycling';
// import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
// import { useNavigate } from 'react-router-dom';
// import { useSearchParams } from 'react-router-dom';
// import { useUser } from '../../../context/UserContext';
// import { CheckCircle, Clover, Leaf, WarningDiamond } from '@phosphor-icons/react';

// const CardStyled = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(4),
//   gap: theme.spacing(1),
//   margin: 'auto',
//   boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
//   width: '100%',
//   backgroundColor:'#FFF',
//   [theme.breakpoints.up('sm')]: {
//     width: '450px',
//   },
// }));

// const options = {
//   paper: ['Paper 1', 'Paper 2', 'Paper 3','Paper 1', 'Paper 2', 'Paper 3','Paper 1', 'Paper 2', 'Paper 3','Paper 1', 'Paper 2', 'Paper 3',],
//   plastic: ['Plastic 1', 'Plastic 2', 'Plastic 3'],
//   metal: ['Metal 1', 'Metal 2', 'Metal 3'],
//   glass: ['Glass 1', 'Glass 2', 'Glass 3'],
// };
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };
// const Booking = () => {
//   const { user } = useUser();
//   const [formData, setFormData] = useState({
//     mobile: user ? user.userMobile : '',
//     area: user ? user.area : '',
//     address: user ? user.address : '',
//   });
//   const [searchParams] = useSearchParams();
//   const [pickUpDate, setpickUpDate] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(null);
//   const [mobileError, setMobileError] = React.useState(false);
//   const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
//   const [trashtype, setTrashtype] = React.useState({
//     paper: [],
//     plastic: [],
//     metal: [],
//     glass: [],
//   });
//   const [modal, setModal] = useState({ open: false, title: '', message: '', action: null, img: '' });
//   const [currentStep, setCurrentStep] = useState(0);
//   const navigate = useNavigate();
//   const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const step = searchParams.get('step');
//     if (step) {
//       setCurrentStep(Number(step));
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     // Retrieve saved data from sessionStorage
//     const savedData = JSON.parse(sessionStorage.getItem('bookingData'));
//     if (savedData) {
//       setFormData(savedData.formData || { mobile: '', area: '', address: '' });
//       setpickUpDate(savedData.pickUpDate ? dayjs(savedData.pickUpDate) : null);
//       setTrashtype(savedData.trashtype || { paper: [], plastic: [], metal: [], glass: [] });
//       setCurrentStep(savedData.currentStep || 0);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload

//     if (!validateStep()) return;
//     const token = sessionStorage.getItem('token');
//     sessionStorage.setItem('RedirectStep', currentStep);
//     if (!token) {
//       setModal({
//         open: true,
//         title: 'Login Required',
//         message: 'Please log in to make a booking!',
//         action: () => window.location.href = '/signin', // Redirect to login
//         img: <WarningDiamond size={40} weight="duotone" color='#9e2a2b'/>

//       });

//       const bookingData = {
//         formData,
//         pickUpDate,
//         trashtype,
//         currentStep,
//       };
//       sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
//       navigate('/signin');

//       return;
//     }

//     // Decode the token and check if it is expired
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000; // Current time in seconds
//       if (decoded.exp < currentTime) {
//         // Token is expired
//         alert('Session expired. Please log in again.');
//         sessionStorage.removeItem('token'); // Remove the expired token
//         sessionStorage.removeItem('RedirectStep'); // Remove the expired token
//         sessionStorage.removeItem('bookingData'); // Remove the expired token
//         setTimeout(() => {
//           window.location.href = '/signin'; // Redirect to the sign-in page
//         }, 1000);
//         return;
//       }
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       setModal({
//         open: true,
//         title: 'Error',
//         message: 'An error occurred. Please try again later.',
//         img: <WarningDiamond size={40} weight="duotone" color='#9e2a2b'/>
//       });
//       return;
//     }

//     try {
//       const response = await fetch(`${REACT_APP_API_URL}/api/bookings/create`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ ...formData, trashtype, pickUpDate }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setSubmitted(true);
//         console.log('Form submission successful!');
//         // Reset form data
//         setModal({
//           open: true,
//           title: 'Congratulations !!',
//           message: 'Your trash pickup has been scheduled successfully',
//           img: <CheckCircle size={40} weight="duotone" color='green'/>

//         });
//         setFormData({
//           mobile: '',
//           area: '',
//           address: ''
//         });
//         setTrashtype({ paper: '', plastic: '', metal: '', glass: '' });
//         setpickUpDate(null);
//         sessionStorage.removeItem('RedirectStep'); // Remove the expired token
//         sessionStorage.removeItem('bookingData'); // Remove the expired token
//         setTimeout(() => {
//           navigate('/myBooking')
//         }, 3000);
//       } else {
//         console.error('Failed to submit request:', result.message);
//         setModal({
//           open: true,
//           title: 'Failed',
//           message: result.message || 'Failed to submit booking.',
//           img:<WarningDiamond size={40} weight="duotone" color='#9e2a2b'/>
//         });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setModal({
//         open: true,
//         title: 'Error',
//         message: 'An error occurred. Please try again later.',
//         img: <WarningDiamond size={40} weight="duotone" color='#9e2a2b'/>
//       });
//     }
//   };
//   const isWeekend = (date) => {
//     const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday
//     return dayOfWeek === 0 || dayOfWeek === 6; // Return true for Saturday/Sunday
//   };

//   const handleDateChange = (newValue) => {
//     if (!isWeekend(newValue)) {
//       setModal({
//         open: true,
//         title: 'Date Not Available',
//         message: 'Weekdays are already booked. Please select a weekend (Saturday or Sunday).',
//         img: <WarningDiamond size={40} weight="duotone" color='#9e2a2b'/>
//       });
//     } else {
//       setpickUpDate(newValue);
//     }
//   };
//   const validateStep = () => {
//     switch (currentStep) {
//       case 0:
//         return Object.keys(trashtype).some(category => trashtype[category].length > 0);
//         case 1:
//           return (
//             ((user && user.mobile && user.mobile.length === 10) || (formData && formData.mobile && formData.mobile.length === 10))
//             && !mobileError
//             && ((user && user.area && user.area !== '') || (formData && formData.area && formData.area !== ''))
//             && ((user && user.address && user.address !== '') || (formData && formData.address && formData.address !== ''))
//           );
//               case 2:
//         return pickUpDate !== null ;
//         case 3:
//           return true;
//           default:
//         return false;
//     }
//   };
//    const handleNext = () => {
//     setCurrentStep((prev) => Math.min(prev + 1, 3));
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//   };

//   const handleSelectionChange = (category, event) => {
//     const { target: { value } } = event;
//     setTrashtype(prevState => ({
//       ...prevState,
//       [category]: value // Remove duplicates within the same category
//     }));
//   };

//   const handleDeleteChip = (category, chip) => {
//     setTrashtype(prevState => ({
//       ...prevState,
//       [category]: prevState[category].filter(item => item !== chip)
//     }));
//   };

//   return (
//     <Box py={12} height={'100vh'} display="flex" flexDirection={'column'} alignItems="center" justifyContent="center"
//     sx={{backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)"}}>
//           <Typography component="h1"
//         variant="h4"
//         sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)' , display: 'flex', alignItems:'center', justifyContent:'center'}}
//         mb={1}
//         textAlign={'center'}>
//          <Leaf size={32} weight="duotone" color='green'/>{currentStep === 0 ? "Select Trash": currentStep === 1 ?  "Pickup Details" : currentStep === 2 ? "Schedule Pickup" : "Pickup Summary"}
//           </Typography>
//       <Container direction="column" justifyContent="center">
//         <CardStyled variant="outlined">
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//           <form  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} method="POST">
//             <Box mt={2} sx={{width:'100%', display: 'flex', flexDirection: 'column'}}>
//             {/* {currentStep === 0 && (
//               <FormControl>
//                 <FormLabel htmlFor="TrashType">Trash Type</FormLabel>
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 0.8 }}>
//                   {trashtype.map((option, index) => (
//                     <Chip
//                       sx={{ backgroundColor: '#c7f9cc' }}
//                       key={option}
//                       label={option}
//                       onDelete={() => {
//                         // Handle deletion of a tag
//                         const updatedOptions = trashtype.filter((_, i) => i !== index);
//                         setTrashtype(updatedOptions);
//                       }}
//                     />
//                   ))}
//                 </Box>
//                 <Autocomplete
//                   multiple
//                   id="tags-select"
//                   size="small"
//                   options={options}
//                   value={trashtype}
//                   onChange={handleAutocompleteChange}
//                   renderTags={() => null}
//                   renderInput={(params) => (
//                     <TextField {...params} variant="outlined" placeholder="Select..." sx={{
//                       '.MuiOutlinedInput-root': {},
//                       '.MuiInputLabel-root': { top: '-5px' }, // Adjust label position
//                       '.MuiAutocomplete-endAdornment': {
//                         display: 'flex',
//                         gap: '5px', // Adds spacing between close and dropdown buttons
//                         '.MuiIconButton-root': {
//                           width: '1.8rem',
//                           height: '1.8rem',
//                           // Adjust margin-right for individual buttons
//                         },
//                       },
//                     }} />
//                   )}
//                 />

//               </FormControl>
//             )} */}
//         {currentStep === 0 && (
//         <>
//           {Object.keys(options).map((category) => (
//             <FormControl key={category} >
//               <FormLabel id={`${category}-select-label`}>{category.charAt(0).toUpperCase() + category.slice(1)}</FormLabel>
//               <Select
//                 labelId={`${category}-select-label`}
//                 id={`${category}-select`}
//                 multiple
//                 value={trashtype[category]}
//                 onChange={(event) => handleSelectionChange(category, event)}
//                 input={<OutlinedInput label={category.charAt(0).toUpperCase() + category.slice(1)} />}
//                 renderValue={(selected) => selected.join(', ')}
//                 MenuProps={MenuProps}
//               >
//                 {options[category].map((option) => (
//                   <MenuItem key={option} value={option}>
//                     <Checkbox checked={trashtype[category].includes(option)} />
//                     <ListItemText primary={option} />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           ))}

//           {/* Separate section for displaying chips */}
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
//           {Object.entries(trashtype).map(([category, options]) => {
//             if (Array.isArray(options)) {
//               return options.map((option) => (
//                 <Chip
//                   key={`${category}-${option}`}
//                   label={option}
//                   onDelete={() => handleDeleteChip(category, option)}
//                   sx={{ backgroundColor: '#3a5a40', color:'#FFF' , padding:'10px', '& .MuiChip-label': {
//                     color: '#FFF', // Ensure the text inside the Chip is white
//                   }, }}
//                 />
//               ));
//             }
//             return null; // Handle non-array cases
//           })}
//         </Box>
//                 </>
//               )}
//                 {/* <Button  fullWidth
//                 className="buttons"
//                 variant="contained" onClick={()=>setTrashtypeBool(true)}>Proceed <KeyboardDoubleArrowRightRoundedIcon /></Button>
//               */}
//                {currentStep === 1 && (
//                <Box display='flex' flexDirection='column' gap='5px'>
//                <FormControl>
//                 <FormLabel htmlFor="mobile">Mobile No.</FormLabel>
//                 <TextField
//                   required
//                   fullWidth
//                   id="mobile"
//                   placeholder="0123456789"
//                   name="mobile"
//                   autoComplete="mobile"
//                   variant="outlined"
//                   error={mobileError}
//                   helperText={mobileErrorMessage}
//                   color={mobileError ? 'error' : 'primary'}
//                   value={formData.mobile}
//                   onChange={(e) => {
//                     let value = e.target.value;
//                     value = value.replace(/[^0-9]/g, '');
//                     setFormData({ ...formData, mobile: value });

//                     if (value.length !== 10 || isNaN(value)) {
//                       setMobileError(true);
//                       setMobileErrorMessage('Mobile number must be exactly 10 digits long and contain only numbers.');
//                     } else if (!/^[7-9]\d{9}$/.test(value)) {
//                       setMobileError(true);
//                       setMobileErrorMessage('Mobile number must start with 7, 8, or 9.');
//                     } else {
//                       setMobileError(false);
//                       setMobileErrorMessage('');
//                     }
//                   }}
//                 />
//                </FormControl>
//                <FormControl>
//                 <FormLabel htmlFor="area">Service Area</FormLabel>
//                 <Select
//                   required
//                   fullWidth
//                   id="area"
//                   name="area"
//                   value={formData.area}
//                   onChange={handleChange}
//                 >
//                   <MenuItem value="" selected>Select Area</MenuItem>
//                   <MenuItem value="Kothrud">Kothrud</MenuItem>
//                   <MenuItem value="Karve Nagar">Karve Nagar</MenuItem>
//                   <MenuItem value="Warje">Warje</MenuItem>
//                   <MenuItem value="Shivane">Shivane</MenuItem>
//                 </Select>
//               </FormControl>
//               <FormControl>
//                 <FormLabel htmlFor="address">Address</FormLabel>
//                 <TextField
//                   required
//                   fullWidth
//                   name="address"
//                   placeholder="Enter your address"
//                   type="text"
//                   id="address"
//                   variant="outlined"
//                   color="primary"
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//                 </Box>
//                )}

//               {currentStep === 2 && (
//               <FormControl>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <FormControl>
//                   <FormLabel htmlFor="date">Select Date</FormLabel>
//                   <DatePicker
//                     value={pickUpDate}
//                     onChange={handleDateChange}
//                     minDate={dayjs()} // Disables all dates before today
//                     shouldDisableDate={(date) => !isWeekend(date)}
//                     renderInput={(params) => <TextField {...params} required />}
//                     slotProps={{
//                       layout: {
//                         sx: {
//                           '& .css-d5tqgl-MuiButtonBase-root-MuiPickersDay-root.Mui-disabled:not(.Mui-selected)':{
//                             color:'red',
//                             fontSize:'13px',
//                             textDecoration:'line-through',
//                             textDecorationColor:'#101010'
//                           },
//                           '& .css-d5tqgl-MuiButtonBase-root-MuiPickersDay-root':{
//                             color:'green',
//                             fontSize:'13px',
//                             fontWeight:'600'
//                           },
//                           '& .css-d5tqgl-MuiButtonBase-root-MuiPickersDay-root.Mui-selected' : {
//                             color:'white',
//                             fontSize:'13px'
//                           },
//                           color: '#1565c0',
//                           borderRadius: '0px',
//                           borderWidth: '0px',
//                           borderColor: '#2196f3',
//                           border: '0px solid',
//                         //  backgroundColor: '#90caf9',
//                           '& .MuiPickersDay-day-6': {  // Saturday
//                             backgroundColor: 'red',   // Red background for Saturday
//                           },
//                           '& .MuiPickersDay-day-7': {  // Sunday
//                             backgroundColor: 'red',   // Red background for Sunday
//                           },
//                         }
//                       }
//                     }}
//                   />
//                 </FormControl>
//               </LocalizationProvider>
//               </FormControl>
//               )}

//               {currentStep === 3 && (
//             <Card
//              sx={{ maxWidth: 345,
//               background: '#4AC29A',  /* fallback for old browsers */
//               background: '-webkit-linear-gradient(to right, #BDFFF3, #4AC29A)',  /* Chrome 10-25, Safari 5.1-6 */
//               background:' linear-gradient(to right, #BDFFF3, #4AC29A)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
//               borderRadius:'20px'

//              }}>
//             <CardActionArea>
//               <CardContent sx={{display:'flex', flexDirection:'column', gap:'10px'}}>
//                 <Box>
//                 <Typography variant="body2" fontWeight={600}  component="div">
//                   Trash Type :
//                 </Typography>
//                 <List>
//                     {
//                       Object.entries(trashtype).map(([key, values], index) => (
//                         <React.Fragment key={index}>
//                           {
//                          values  &&  values.map((tra, subIndex) => (
//                               <ListItem sx={{ padding: '0' }} key={subIndex}>
//                                 <ListItemIcon>
//                                   <RecyclingIcon sx={{ marginRight: '5px' }} />
//                                 </ListItemIcon>
//                                 <ListItemText primary={tra} />
//                               </ListItem>
//                             ))
//                           }
//                         </React.Fragment>
//                       ))
//                     }
//                   </List>

//                 </Box>
//                   <Box>
//                   <Typography variant="body2" fontWeight={600} component="div">
//                   Mobile No : <span style={{fontWeight:'normal'}}> {formData.mobile} </span >
//                 </Typography>
//                   </Box>
//                   <Box>
//                 <Typography variant="body2" fontWeight={600} component="div">
//                   Area :  <span style={{fontWeight:'normal'}}> {formData.area} </span >
//                 </Typography>
//                   </Box>
//                   <Box>
//                 <Typography variant="body2" fontWeight={600} component="div">
//                   Address : <span style={{fontWeight:'normal'}}> {formData.address} </span>
//                 </Typography>
//                   </Box>
//                   <Box>
//                 <Typography variant="body2" fontWeight={600} component="div">
//                   Scheduled pickup date : <span style={{fontWeight:'normal'}}>  {pickUpDate && pickUpDate.format('DD-MM-YYYY')}</span >
//                 </Typography>
//                   </Box>
//               </CardContent>
//             </CardActionArea>
//           </Card>
//           )}
//            <Box mt={2} display="flex" justifyContent="space-between">
//                 {currentStep > 0 && (
//                   <Button
//                     variant="text"
//                     onClick={handleBack}
//                     startIcon={<KeyboardArrowLeft />}
//                   >
//                     Back
//                   </Button>
//                 )}
//                {currentStep !== 3 ? (
//                     <div aria-hidden="true">
//                       <Button
//                         type='button'
//                         color={!validateStep() ? 'error' : 'primary'}
//                         variant="contained"
//                         onClick={handleNext}
//                         endIcon={<KeyboardArrowRight />}
//                         disabled={!validateStep()}
//                       >
//                         Proceed
//                       </Button>
//                     </div>
//                   ) : (
//                     <div aria-hidden="false">
//                       <Button
//                         onClick={handleSubmit}
//                         variant="contained"
//                         disabled={!validateStep()}
//                         endIcon={<ArrowCircleRightRoundedIcon />}
//                       >
//                         Submit
//                       </Button>
//                     </div>
//                   )}
//               </Box>
//             </Box>

//           </form>

//         </CardStyled>
//         <TransitionsModal
//           open={modal.open}
//           onClose={() => setModal({ ...modal, open: false })}
//           title={modal.title}
//           message={modal.message}
//           action={modal.action}
//           img={modal.img}
//         />
//       </Container>
//     </Box>
//   );
// };

// export default Booking;

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  Card,
  styled,
  Chip,
  Container,
  CardContent,
  CardActionArea,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Use the named import
import TransitionsModal from "./Modal";
import warning from "../assets/warning.png";
import confirm from "../assets/confirm.gif";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs"; // Optional for date manipulation
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import RecyclingIcon from "@mui/icons-material/Recycling";
import ArrowCircleRightRoundedIcon from "@mui/icons-material/ArrowCircleRightRounded";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import {
  CheckCircle,
  Clover,
  Leaf,
  WarningDiamond,
} from "@phosphor-icons/react";
import { useAuth } from "../../../context/AuthContext";
import leafy from "../assets/leafy.jpg";
const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  gap: theme.spacing(1),
  margin: "auto",
  backgroundColor: "#F8F9F4",
  backgroundImage: `Url(${leafy})`,
  backgroundPosition: "90px center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const options = [
  "E-waste -Rs.10/kg",
  "Plastic -Rs.10/kg",
  "Newspaper -Rs.17/kg",
  "Iron -Rs.25/kg",
  "Cardboard -Rs.6/kg",
  "Aluminum -Rs.100/kg",
  "Steel -Rs.35/kg",
  "Refrigerator -Rs.600/kg",
  "Air conditioner -Rs.2500/kg",
  "Washing Machine -Rs.500/Pc",
  "Motor -Rs.30/kg",
  "Battery -Rs.55/kg",
  "Copper -Rs.400/kg",
  "Insulated wire -Rs.40/kg",
  "LCD/LED TV -Rs.100",
  "CPU -Rs.150",
  "Toys -Rs.2/kg",
  "Bottles -Rs.0/pc",
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const groupedOptions = {
  "Recyclable Items": options,
};
const Booking = () => {
  const { user, setUser } = useUser();
  const { token, setToken } = useAuth(); // Access setToken from AuthContext
  const [formData, setFormData] = useState({
    mobile: user ? user.userMobile : "",
    area: user ? user.area : "",
    address: user ? user.address : "",
  });
  const [searchParams] = useSearchParams();
  const [pickUpDate, setpickUpDate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState("");
  const [trashtype, setTrashtype] = useState(
    Object.keys(groupedOptions).reduce((acc, category) => {
      acc[category] = [];
      return acc;
    }, {})
  );
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
    img: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setCurrentStep(Number(step));
    }
  }, [searchParams]);

  useEffect(() => {
    // Retrieve saved data from sessionStorage
    const savedData = JSON.parse(sessionStorage.getItem("bookingData"));
    if (savedData) {
      setFormData(savedData.formData || { mobile: "", area: "", address: "" });
      setpickUpDate(savedData.pickUpDate ? dayjs(savedData.pickUpDate) : null);
      setTrashtype(
        savedData.trashtype || { paper: [], plastic: [], metal: [], glass: [] }
      );
      setCurrentStep(savedData.currentStep || 0);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!validateStep()) return;
    const token = sessionStorage.getItem("token");
    sessionStorage.setItem("RedirectStep", currentStep);
    if (!token) {
      setModal({
        open: true,
        title: "Login Required",
        message: "Please log in to make a booking!",
        action: () => (window.location.href = "/signin"), // Redirect to login
        img: <WarningDiamond size={40} weight="duotone" color="#9e2a2b" />,
      });

      const bookingData = {
        formData,
        pickUpDate,
        trashtype,
        currentStep,
      };
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      navigate("/signin");

      return;
    }

    // Decode the token and check if it is expired
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp < currentTime) {
        // Token is expired
        alert("Session expired. Please log in again.");
        sessionStorage.removeItem("token"); // Remove the expired token
        sessionStorage.removeItem("RedirectStep"); // Remove the expired token
        sessionStorage.removeItem("bookingData"); // Remove the expired token
        setTimeout(() => {
          window.location.href = "/signin"; // Redirect to the sign-in page
        }, 1000);
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setModal({
        open: true,
        title: "Error",
        message: "An error occurred. Please try again later.",
        img: <WarningDiamond size={40} weight="duotone" color="#9e2a2b" />,
      });
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, trashtype, pickUpDate }),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
        console.log("Form submission successful!", result);
        sessionStorage.setItem("token", result.token); // Store the new token
        setToken(result.token); // Save token globally using context
        // Decode the token and set user data in UserContext
        const decodedUserData = jwtDecode(result.token); // Decode the JWT token
        setUser(decodedUserData); // Save user data in UserContext
        // Reset form data
        setModal({
          open: true,
          title: "Congratulations !!",
          message: "Your trash pickup has been scheduled successfully",
          img: <CheckCircle size={40} weight="duotone" color="green" />,
        });
        setFormData({
          mobile: "",
          area: "",
          address: "",
        });
        setTrashtype({ paper: "", plastic: "", metal: "", glass: "" });
        setpickUpDate(null);
        sessionStorage.removeItem("RedirectStep"); // Remove the expired token
        sessionStorage.removeItem("bookingData"); // Remove the expired token
        setTimeout(() => {
          navigate("/myBooking");
        }, 3000);
      } else {
        console.error("Failed to submit request:", result.message);
        setModal({
          open: true,
          title: "Failed",
          message: result.message || "Failed to submit booking.",
          img: <WarningDiamond size={40} weight="duotone" color="#9e2a2b" />,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setModal({
        open: true,
        title: "Error",
        message: "An error occurred. Please try again later.",
        img: <WarningDiamond size={40} weight="duotone" color="#9e2a2b" />,
      });
    }
  };
  const isWeekend = (date) => {
    const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday
    return dayOfWeek === 0 || dayOfWeek === 6; // Return true for Saturday/Sunday
  };

  const handleDateChange = (newValue) => {
    if (!isWeekend(newValue)) {
      setModal({
        open: true,
        title: "Date Not Available",
        message:
          "Weekdays are already booked. Please select a weekend (Saturday or Sunday).",
        img: <WarningDiamond size={40} weight="duotone" color="#9e2a2b" />,
      });
    } else {
      setpickUpDate(newValue);
    }
  };
  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return Object.keys(trashtype).some(
          (category) => trashtype[category].length > 0
        );
      case 1:
        return (
          ((user && user.mobile && user.mobile.length === 10) ||
            (formData && formData.mobile && formData.mobile.length === 10)) &&
          !mobileError &&
          ((user && user.area && user.area !== "") ||
            (formData && formData.area && formData.area !== "")) &&
          ((user && user.address && user.address !== "") ||
            (formData && formData.address && formData.address !== ""))
        );
      case 2:
        return pickUpDate !== null;
      case 3:
        return true;
      default:
        return false;
    }
  };
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSelectionChange = (category, event) => {
    const {
      target: { value },
    } = event;
    setTrashtype((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleDeleteChip = (category, option) => {
    setTrashtype((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== option),
    }));
  };

  return (
    <Box
      py={12}
      height={"100vh"}
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage:
          "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)",
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{
          width: "100%",
          fontSize: "clamp(1rem, 5vw, 1. 5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        mb={1}
        textAlign={"center"}
      >
        <Leaf size={32} weight="duotone" color="green" />
        {currentStep === 0
          ? "Select Trash"
          : currentStep === 1
          ? "Pickup Details"
          : currentStep === 2
          ? "Schedule Pickup"
          : "Pickup Summary"}
      </Typography>
      <Container direction="column" justifyContent="center">
        <CardStyled variant="outlined">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            method="POST"
          >
            <Box
              mt={2}
              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* {currentStep === 0 && (
              <FormControl>
                <FormLabel htmlFor="TrashType">Trash Type</FormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 0.8 }}>
                  {trashtype.map((option, index) => (
                    <Chip
                      sx={{ backgroundColor: '#c7f9cc' }}
                      key={option}
                      label={option}
                      onDelete={() => {
                        // Handle deletion of a tag
                        const updatedOptions = trashtype.filter((_, i) => i !== index);
                        setTrashtype(updatedOptions);
                      }}
                    />
                  ))}
                </Box>
                <Autocomplete
                  multiple
                  id="tags-select"
                  size="small"
                  options={options}
                  value={trashtype}
                  onChange={handleAutocompleteChange}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Select..." sx={{
                      '.MuiOutlinedInput-root': {},
                      '.MuiInputLabel-root': { top: '-5px' }, // Adjust label position
                      '.MuiAutocomplete-endAdornment': {
                        display: 'flex',
                        gap: '5px', // Adds spacing between close and dropdown buttons
                        '.MuiIconButton-root': {
                          width: '1.8rem',
                          height: '1.8rem',
                          // Adjust margin-right for individual buttons
                        },
                      },              
                    }} />
                  )}
                />
                
              </FormControl>
            )} */}
              {currentStep === 0 && (
                <>
                  {Object.keys(groupedOptions).map((category) => (
                    <Card sx={{
                      backgroundColor: "#f8f9f4cf",
                      borderRadius: "20px",
                      color: "#101010",
                      width:'100%'
                    }}>
                    <FormControl key={category} sx={{width:'100%'}}>
                      <FormLabel id={`${category}-select-label`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </FormLabel>
                      <Select
                      sx={{ width:'100%' }}
                        labelId={`${category}-select-label`}
                        id={`${category}-select`}
                        multiple
                        fullWidth
                        value={trashtype[category]}
                        onChange={(event) =>
                          handleSelectionChange(category, event)
                        }
                        input={
                          <OutlinedInput
                            label={
                              category.charAt(0).toUpperCase() +
                              category.slice(1)
                            }
                          />
                        }
                        renderValue={() => "Select"}
                        displayEmpty
                        MenuProps={MenuProps}
                      >
                        {groupedOptions[category].map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox
                              checked={trashtype[category].includes(option)}
                            />
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    </Card>
                  ))}

                  {/* Chips Section */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      marginTop: 2,
                    }}
                  >
                    {Object.entries(trashtype).map(
                      ([category, selectedOptions]) =>
                        selectedOptions.map((option) => (
                          <Chip
                            key={`${category}-${option}`}
                            label={option}
                            onDelete={() => handleDeleteChip(category, option)}
                            sx={{
                              backgroundColor: "#f8f9f4cf",
                              color: "#101010",
                              height: "32px",
                              justifyContent: "space-between",
                              maxHeight: "32px",
                              padding: "10px",
                              "& .MuiChip-label": {
                                color: "#4a4e69",
                                fontSize: "14px",
                              },
                            }}
                          />
                        ))
                    )}
                  </Box>
                </>
              )}
              {/* <Button  fullWidth
                className="buttons"
                variant="contained" onClick={()=>setTrashtypeBool(true)}>Proceed <KeyboardDoubleArrowRightRoundedIcon /></Button>
              */}
              {currentStep === 1 && (
               <Card sx={{
                backgroundColor: "#f8f9f4cf",
                borderRadius: "20px",
                color: "#101010",
              }}>
               <Box display="flex" flexDirection="column" gap="5px">
                  <FormControl>
                    <FormLabel htmlFor="mobile">Mobile No.</FormLabel>
                    <TextField
                      required
                      fullWidth
                      id="mobile"
                      placeholder="0123456789"
                      name="mobile"
                      autoComplete="mobile"
                      variant="outlined"
                      error={mobileError}
                      helperText={mobileErrorMessage}
                      color={mobileError ? "error" : "primary"}
                      value={formData.mobile}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        setFormData({ ...formData, mobile: value });

                        if (value.length !== 10 || isNaN(value)) {
                          setMobileError(true);
                          setMobileErrorMessage(
                            "Mobile number must be exactly 10 digits long and contain only numbers."
                          );
                        } else if (!/^[7-9]\d{9}$/.test(value)) {
                          setMobileError(true);
                          setMobileErrorMessage(
                            "Mobile number must start with 7, 8, or 9."
                          );
                        } else {
                          setMobileError(false);
                          setMobileErrorMessage("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="area">Service Area</FormLabel>
                    <Select
                      required
                      fullWidth
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                    >
                      <MenuItem value="" selected>
                        Select Area
                      </MenuItem>
                      <MenuItem value="Kothrud">Kothrud</MenuItem>
                      <MenuItem value="Karve Nagar">Karve Nagar</MenuItem>
                      <MenuItem value="Warje">Warje</MenuItem>
                      <MenuItem value="Shivane">Shivane</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <TextField
                      required
                      fullWidth
                      name="address"
                      placeholder="Enter your address"
                      type="text"
                      id="address"
                      variant="outlined"
                      color="primary"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Box>
              </Card>
              )}

              {currentStep === 2 && (
                <Card sx={{
                  backgroundColor: "#f8f9f4cf",
                  borderRadius: "20px",
                  color: "#101010",
                }}>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormControl>
                      <FormLabel htmlFor="date">Select Date</FormLabel>
                      <DatePicker
                      sx={{backgroundColor:'transparent', border:'1px solid lightgray', borderRadius:'8px'}}
                        value={pickUpDate}
                        onChange={handleDateChange}
                        minDate={dayjs()} // Disables all dates before today
                        shouldDisableDate={(date) => !isWeekend(date)}
                        renderInput={(params) => (
                          <TextField {...params} required />
                        )}
                        slotProps={{
                          layout: {
                            sx: {
                              "& .css-d5tqgl-MuiButtonBase-root-MuiPickersDay-root.Mui-disabled:not(.Mui-selected)":
                                {
                                  color: "red",
                                  fontSize: "13px",
                                  textDecoration: "line-through",
                                  textDecorationColor: "#101010",
                                },
                              "& .css-d5tqgl-MuiButtonBase-root-MuiPickersDay-root":
                                {
                                  color: "green",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                },
                              "& .MuiPickersArrowSwitcher-root": {
                                gap: "3px",
                              },
                              "& .css-d5tqgl-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                                {
                                  color: "white",
                                  fontSize: "13px",
                                },
                              color: "#1565c0",
                              borderRadius: "0px",
                              borderWidth: "0px",
                              borderColor: "#2196f3",
                              border: "0px solid",
                              //  backgroundColor: '#90caf9',
                              "& .MuiPickersDay-day-6": {
                                // Saturday
                                backgroundColor: "red", // Red background for Saturday
                              },
                              "& .MuiPickersDay-day-7": {
                                // Sunday
                                backgroundColor: "red", // Red background for Sunday
                              },
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </LocalizationProvider>
                </FormControl>
                </Card>
              )}
              {currentStep === 3 && (
                <>
                  <Card
                    sx={{
                      maxWidth: 345,
                      backgroundColor: "#f8f9f4cf",
                      borderRadius: "20px",
                      color: "#101010",
                      boxShadow:
                        "rgba(28, 115, 1, 0.25) 0px 2px 5px -1px, rgba(63, 225, 34, 0.3) 0px 1px 3px -1px",
                    }}
                  >
                    <CardActionArea>
                      <CardContent
                        sx={{ 
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            component="div"
                            sx={{fontSize:'16px',color:'#495057'}}
                          >
                            Trash Type :
                          </Typography>
                          <List>
                            {Object.entries(trashtype).map(
                              ([key, values], index) => (
                                <React.Fragment key={index}>
                                  {values &&
                                    values.map((tra, subIndex) => (
                                      <ListItem
                                        sx={{ padding: "0" }}
                                        key={subIndex}
                                      >
                                        <ListItemIcon>
                                          <RecyclingIcon
                                            sx={{ marginRight: "5px" }}
                                          />
                                        </ListItemIcon>
                                        <ListItemText primary={tra}/>
                                      </ListItem>
                                    ))}
                                </React.Fragment>
                              )
                            )}
                          </List>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            component="div"
                            sx={{fontSize:'16px', color:'#495057'}}
                          >
                            Mobile No :{" "}
                            <span style={{ fontWeight: "600", color:'#004e64' }}>
                              {" "}
                              {formData.mobile}{" "}
                            </span>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            component="div"
                            sx={{fontSize:'16px', color:'#495057'}}
                          >
                            Area :{" "}
                            <span style={{ fontWeight: "bold" , color:'#004e64'}}>
                              {" "}
                              {formData.area}{" "}
                            </span>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            component="div"
                            sx={{fontSize:'16px', color:'#495057'}}
                          >
                            Address :{" "}
                            <span style={{ fontWeight: "bold" , color:'#004e64'}}>
                              {" "}
                              {formData.address}{" "}
                            </span>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            component="div"
                            sx={{fontSize:'16px', color:'#495057'}}
                          >
                            Scheduled pickup date :{" "}
                            <span style={{ fontWeight: "bold" , color:'#004e64'}}>
                              {" "}
                              {pickUpDate && pickUpDate.format("DD-MM-YYYY")}
                            </span>
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Card
                    sx={{
                      backgroundColor: "#f8f9f4cf",
                      borderRadius: "20px",
                      marginTop: "20px",
                      padding: "15px",
                      boxShadow:
                        "rgba(28, 115, 1, 0.25) 0px 2px 5px -1px, rgba(63, 225, 34, 0.3) 0px 1px 3px -1px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: "#00296b", // White text color
                          fontSize: "20px",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                        component="div"
                      >
                        Claim Your Reward
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#00296b", // White text for the coin amount
                            fontWeight: "bold",
                            fontSize: "32px",
                            marginRight: "10px",
                          }}
                        >
                          500
                        </Typography>
                        <Leaf size={35} weight="duotone" color="green" />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#00296b",
                          marginTop: "5px",
                          fontSize: "14px",
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                        }}
                        component="div"
                      >
                        Complete this booking and Coins Are Yours!!
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}
              <Box mt={2} display="flex" justifyContent="space-between">
                {currentStep > 0 && (
                  <Button
                    variant="text"
                    onClick={handleBack}
                    startIcon={<KeyboardArrowLeft />}
                  >
                    Back
                  </Button>
                )}
                {currentStep !== 3 ? (
                  <div aria-hidden="true">
                    <Button
                      type="button"
                      color={!validateStep() ? "error" : "primary"}
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<KeyboardArrowRight />}
                      disabled={!validateStep()}
                    >
                      Proceed
                    </Button>
                  </div>
                ) : (
                  <div aria-hidden="false">
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={!validateStep()}
                      endIcon={<ArrowCircleRightRoundedIcon />}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </Box>
            </Box>
          </form>
        </CardStyled>
        <TransitionsModal
          open={modal.open}
          onClose={() => setModal({ ...modal, open: false })}
          title={modal.title}
          message={modal.message}
          action={modal.action}
          img={modal.img}
        />
      </Container>
    </Box>
  );
};

export default Booking;
