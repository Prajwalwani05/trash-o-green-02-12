// import * as React from 'react';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { CalendarDots, ClipboardText, Clock, House, ShoppingCartSimple} from "@phosphor-icons/react";
// import { useUser } from '../../context/UserContext';

// export default function FixedBottomNavigation() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [value, setValue] = React.useState(location.pathname); // Initialize with the current path
//   const [tokenFlag, setTokenFlag] = React.useState(false);
//   const [viewNavigation, setViewNavigation] = React.useState('user');
//   const { user } = useUser();

//   React.useEffect(() => {
//     setTokenFlag(!!user);
//     setValue(location.pathname); // Update the value whenever location changes
//     console.log(user);
//     // if(user.role === 'Trashman'){
//     //   setViewNavigation('Trashman');
//     // }
//     // else if(user.role === 'Admin'){
//     //   setViewNavigation('Admin');
//     // }
//     // else{
//     //   setViewNavigation('user');
//     // }
//   }, [location.pathname, user]); // Depend on both location.pathname and user
  
//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
   
//         <BottomNavigation
//           showLabels
//           value={value}
//           onChange={(event, newValue) => setValue(newValue)}
//           sx={{ backgroundImage:
//             "radial-gradient(80% 80% at 50% 20%, rgb(204, 242, 218), transparent)", boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
//           style={{ position: 'fixed', bottom: '-1px', width:'100%', zIndex: 1000 }}
//         >
//           <BottomNavigationAction
//           sx={{maxWidth:'none', minWidth:'auto',
//             '& .MuiBottomNavigationAction-label.Mui-selected': {
//               fontSize: '0.8rem',
//               color:'green'
//             },
//             '& .MuiBottomNavigationAction-label': {
//               fontSize: '0.7rem',
//             },
//           }}
//             value="/" label="Home"
//             icon={<House  size={20} color={value === '/' ? "green" : "gray"}  weight= {value === '/' ? "fill": "regular"}/>}
//             onClick={() => handleNavigation('/')}
//           />
//           <BottomNavigationAction
//         sx={{maxWidth:'none', minWidth:'auto',
//           '& .MuiBottomNavigationAction-label.Mui-selected': {
//             fontSize: '0.8rem',
//             color:'green'
//           },
//           '& .MuiBottomNavigationAction-label': {
//             fontSize: '0.7rem',
//           },
//         }}
//             value="/booking" label="Schedule"
//             icon={<ClipboardText size={20} color={value === '/booking' ? "green" : "gray"}  weight= {value === '/booking' ? "fill": "regular"}/>}
//             onClick={() => handleNavigation('/booking')}
//           />
//           { tokenFlag &&
//             <BottomNavigationAction
//            sx={{maxWidth:'none', minWidth:'auto',
//             '& .MuiBottomNavigationAction-label.Mui-selected': {
//               fontSize: '0.8rem',
//               color:'green'
//             },
//             '& .MuiBottomNavigationAction-label': {
//               fontSize: '0.7rem',
//             },
//           }}
//             value="/myBooking" label="Bookings"
//             icon={<Clock size={20} color={value === '/myBooking' ? "green" : "gray"}  weight= {value === '/myBooking' ? "fill": "regular"}/>}
//             onClick={() => handleNavigation('/myBooking')}
//           />}
//           <BottomNavigationAction
//           sx={{maxWidth:'none', minWidth:'auto',
//             '& .MuiBottomNavigationAction-label.Mui-selected': {
//               fontSize: '0.8rem',
//               color:'green'
//             },
//             '& .MuiBottomNavigationAction-label': {
//               fontSize: '0.7rem',
//             },
//           }}
//           disabled
//             value="/products"
//             label="Products"
//             icon={<ShoppingCartSimple   size={20} color={value === '/products' ? "green" : "gray"}  weight= {value === '/products' ? "fill": "regular"}/>}
//             onClick={() => handleNavigation('/products')}
//           />
//         </BottomNavigation>
//   );
// }













import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alarm, CalendarDots, ClipboardText, Clock, House, Person, ShoppingCartSimple} from "@phosphor-icons/react";
import { useUser } from '../../context/UserContext';

export default function FixedBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname); // Initialize with the current path
  const [tokenFlag, setTokenFlag] = React.useState(false);
  const [viewNavigation, setViewNavigation] = React.useState('user');
  const { user } = useUser();

  React.useEffect(() => {
    setTokenFlag(!!user);
    setValue(location.pathname); // Update the value whenever location changes
    if(user){
      if(user.userRole === 'Trashman'){
        setViewNavigation('Trashman');
      }
      else if(user.userRole === 'Admin'){
        setViewNavigation('Admin');
      }
      else{
        setViewNavigation('user');
      }
    }
    
  }, [location.pathname, user]); // Depend on both location.pathname and user
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
    {
      (viewNavigation === 'user') ?
      (
        <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      // sx={{ backgroundImage:
      //   "radial-gradient(80% 80% at 50% 20%, rgba(253, 255, 254, 0.24), transparent)", boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
      style={{height:'62px', padding:'5px', backgroundColor:'rgb(255, 255, 255)', position: 'fixed', bottom: '-2px', width:'100%', zIndex: 1000, boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
    >
      <BottomNavigationAction
      sx={{maxWidth:'none', minWidth:'auto',
        '& .MuiBottomNavigationAction-label.Mui-selected': {
          fontSize: '0.8rem',
          color:'green',
          fontWeight:'800',
        },
        '&.Mui-selected':{
          backgroundColor: '#e8ffe8',
          border: '1px solid #7aca7a',
          margin: '2px',
          borderRadius: '15px',
        },
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.7rem',
        },
      }}
        value="/" label="Home"
        icon={<House  size={20} color={value === '/' ? "green" : "gray"}  weight= {value === '/' ? "fill": "regular"}/>}
        onClick={() => handleNavigation('/')}
      />
      <BottomNavigationAction
    sx={{maxWidth:'none', minWidth:'auto',
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: '0.8rem',
        color:'green'
      },
      '&.Mui-selected':{
        backgroundColor: '#e8ffe8',
        border: '1px solid #7aca7a',
        margin: '2px',
        borderRadius: '15px',
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.7rem',
      },
    }}
        value="/booking" label="Schedule"
        icon={<ClipboardText size={20} color={value === '/booking' ? "green" : "gray"}  weight= {value === '/booking' ? "fill": "regular"}/>}
        onClick={() => handleNavigation('/booking')}
      />
      { tokenFlag &&
        <BottomNavigationAction
       sx={{maxWidth:'none', minWidth:'auto',
        '& .MuiBottomNavigationAction-label.Mui-selected': {
          fontSize: '0.8rem',
          color:'green'
        },
        '&.Mui-selected':{
          backgroundColor: '#e8ffe8',
          border: '1px solid #7aca7a',
          margin: '2px',
          borderRadius: '15px',
        },
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.7rem',
        },
      }}
        value="/myBooking" label="Bookings"
        icon={<Clock size={20} color={value === '/myBooking' ? "green" : "gray"}  weight= {value === '/myBooking' ? "fill": "regular"}/>}
        onClick={() => handleNavigation('/myBooking')}
      />}
      <BottomNavigationAction
      sx={{maxWidth:'none', minWidth:'auto',
        '& .MuiBottomNavigationAction-label.Mui-selected': {
          fontSize: '0.8rem',
          color:'green'
        },
        '&.Mui-selected':{
          backgroundColor: '#e8ffe8',
          border: '1px solid #7aca7a',
          margin: '2px',
          borderRadius: '15px',
        },
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.7rem',
        },
      }}
      
        value="/products"
        label="Products"
        icon={<ShoppingCartSimple   size={20} color={value === '/products' ? "green" : "gray"}  weight= {value === '/products' ? "fill": "regular"}/>}
        onClick={() => handleNavigation('/products')}
      />
    </BottomNavigation>
      )
    :
    (viewNavigation === 'Trashman') ?
    (
    <BottomNavigation
    showLabels
    value={value}
    onChange={(event, newValue) => setValue(newValue)}
    // sx={{ backgroundImage:
    //   "radial-gradient(80% 80% at 50% 20%, rgb(204, 242, 218), transparent)", boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
    style={{ backgroundColor:'#FFF', position: 'fixed', bottom: '-1px', width:'100%', zIndex: 1000, boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
  >
    <BottomNavigationAction
    sx={{maxWidth:'none', minWidth:'auto',
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: '0.8rem',
        color:'green'
      },
      '&.Mui-selected':{
        backgroundColor: '#e8ffe8',
        border: '1px solid #7aca7a',
        margin: '2px',
        borderRadius: '15px',
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.7rem',
      },
    }}
      value="/" label="Confirm Pickups"
      icon={<CalendarDots  size={20} color={value === '/' ? "green" : "gray"}  weight= {value === '/' ? "fill": "regular"}/>}
      onClick={() => handleNavigation('/')}
    />
     <BottomNavigationAction
          sx={{maxWidth:'none', minWidth:'auto',
            '& .MuiBottomNavigationAction-label.Mui-selected': {
              fontSize: '0.8rem',
              color:'green'
            },
            '&.Mui-selected':{
              backgroundColor: '#e8ffe8',
              border: '1px solid #7aca7a',
              margin: '2px',
              borderRadius: '15px',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
            },
          }}
            value="/scheduledPickups"
            label="PickUps"
            icon={<Alarm size={20} color={value === '/scheduledPickups' ? "green" : "gray"}  weight= {value === '/scheduledPickups' ? "fill": "regular"}/>}
            onClick={() => handleNavigation('/scheduledPickups')}
          />
      <BottomNavigationAction
     sx={{maxWidth:'none', minWidth:'auto',
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: '0.8rem',
        color:'green'
      },
      '&.Mui-selected':{
        backgroundColor: '#e8ffe8',
        border: '1px solid #7aca7a',
        margin: '2px',
        borderRadius: '15px',
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.7rem',
      },
    }}
      value="/completedBookings" label="Completed"
      icon={<Clock size={20} color={value === '/completedBookings' ? "green" : "gray"}  weight= {value === '/completedBookings' ? "fill": "regular"}/>}
      onClick={() => handleNavigation('/completedBookings')}
    />
   
  </BottomNavigation>
    )
  :
  (
  <BottomNavigation
  showLabels
  value={value}
  onChange={(event, newValue) => setValue(newValue)}
  // sx={{ backgroundImage:
  //   "radial-gradient(80% 80% at 50% 20%, rgb(204, 242, 218), transparent)", boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
  style={{backgroundColor:'#FFF', position: 'fixed', bottom: '-1px', width:'100%', zIndex: 1000 , boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)'}}
>
  <BottomNavigationAction
  sx={{maxWidth:'none', minWidth:'auto',
    '& .MuiBottomNavigationAction-label.Mui-selected': {
      fontSize: '0.8rem',
      color:'green'
    },
    '&.Mui-selected':{
      backgroundColor: '#e8ffe8',
      border: '1px solid #7aca7a',
      margin: '2px',
      borderRadius: '15px',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.7rem',
    },
  }}
    value="/" label="Home"
    icon={<House  size={20} color={value === '/' ? "green" : "gray"}  weight= {value === '/' ? "fill": "regular"}/>}
    onClick={() => handleNavigation('/')}
  />
  <BottomNavigationAction
sx={{maxWidth:'none', minWidth:'auto',
  '& .MuiBottomNavigationAction-label.Mui-selected': {
    fontSize: '0.8rem',
    color:'green'
  },
  '&.Mui-selected':{
    backgroundColor: '#e8ffe8',
    border: '1px solid #7aca7a',
    margin: '2px',
    borderRadius: '15px',
  },
  '& .MuiBottomNavigationAction-label': {
    fontSize: '0.7rem',
  },
}}
    value="/booking" label="Schedule"
    icon={<ClipboardText size={20} color={value === '/booking' ? "green" : "gray"}  weight= {value === '/booking' ? "fill": "regular"}/>}
    onClick={() => handleNavigation('/booking')}
  />
  { tokenFlag &&
    <BottomNavigationAction
   sx={{maxWidth:'none', minWidth:'auto',
    '& .MuiBottomNavigationAction-label.Mui-selected': {
      fontSize: '0.8rem',
      color:'green'
    },
    '&.Mui-selected':{
      backgroundColor: '#e8ffe8',
      border: '1px solid #7aca7a',
      margin: '2px',
      borderRadius: '15px',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.7rem',
    },
  }}
    value="/myBooking" label="Bookings"
    icon={<Clock size={20} color={value === '/myBooking' ? "green" : "gray"}  weight= {value === '/myBooking' ? "fill": "regular"}/>}
    onClick={() => handleNavigation('/myBooking')}
  />}
  <BottomNavigationAction
  sx={{maxWidth:'none', minWidth:'auto',
    '& .MuiBottomNavigationAction-label.Mui-selected': {
      fontSize: '0.8rem',
      color:'green'
    },
    '&.Mui-selected':{
      backgroundColor: '#e8ffe8',
      border: '1px solid #7aca7a',
      margin: '2px',
      borderRadius: '15px',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.7rem',
    },
  }}
  disabled
    value="/products"
    label="Products"
    icon={<ShoppingCartSimple   size={20} color={value === '/products' ? "green" : "gray"}  weight= {value === '/products' ? "fill": "regular"}/>}
    onClick={() => handleNavigation('/products')}
  />
</BottomNavigation>
  )
    }
    </>
        // <BottomNavigation
        //   showLabels
        //   value={value}
        //   onChange={(event, newValue) => setValue(newValue)}
        //   sx={{ backgroundImage:
        //     "radial-gradient(80% 80% at 50% 20%, rgb(204, 242, 218), transparent)", boxShadow: '0 -4px 5px rgba(19, 48, 14, 0.14)' }}
        //   style={{ position: 'fixed', bottom: '-1px', width:'100%', zIndex: 1000 }}
        // >
        //   <BottomNavigationAction
        //   sx={{maxWidth:'none', minWidth:'auto',
        //     '& .MuiBottomNavigationAction-label.Mui-selected': {
        //       fontSize: '0.8rem',
        //       color:'green'
        //     },
        //     '& .MuiBottomNavigationAction-label': {
        //       fontSize: '0.7rem',
        //     },
        //   }}
        //     value="/" label="Home"
        //     icon={<House  size={20} color={value === '/' ? "green" : "gray"}  weight= {value === '/' ? "fill": "regular"}/>}
        //     onClick={() => handleNavigation('/')}
        //   />
        //   <BottomNavigationAction
        // sx={{maxWidth:'none', minWidth:'auto',
        //   '& .MuiBottomNavigationAction-label.Mui-selected': {
        //     fontSize: '0.8rem',
        //     color:'green'
        //   },
        //   '& .MuiBottomNavigationAction-label': {
        //     fontSize: '0.7rem',
        //   },
        // }}
        //     value="/booking" label="Schedule"
        //     icon={<ClipboardText size={20} color={value === '/booking' ? "green" : "gray"}  weight= {value === '/booking' ? "fill": "regular"}/>}
        //     onClick={() => handleNavigation('/booking')}
        //   />
        //   { tokenFlag &&
        //     <BottomNavigationAction
        //    sx={{maxWidth:'none', minWidth:'auto',
        //     '& .MuiBottomNavigationAction-label.Mui-selected': {
        //       fontSize: '0.8rem',
        //       color:'green'
        //     },
        //     '& .MuiBottomNavigationAction-label': {
        //       fontSize: '0.7rem',
        //     },
        //   }}
        //     value="/myBooking" label="Bookings"
        //     icon={<Clock size={20} color={value === '/myBooking' ? "green" : "gray"}  weight= {value === '/myBooking' ? "fill": "regular"}/>}
        //     onClick={() => handleNavigation('/myBooking')}
        //   />}
        //   <BottomNavigationAction
        //   sx={{maxWidth:'none', minWidth:'auto',
        //     '& .MuiBottomNavigationAction-label.Mui-selected': {
        //       fontSize: '0.8rem',
        //       color:'green'
        //     },
        //     '& .MuiBottomNavigationAction-label': {
        //       fontSize: '0.7rem',
        //     },
        //   }}
        //   disabled
        //     value="/products"
        //     label="Products"
        //     icon={<ShoppingCartSimple   size={20} color={value === '/products' ? "green" : "gray"}  weight= {value === '/products' ? "fill": "regular"}/>}
        //     onClick={() => handleNavigation('/products')}
        //   />
        // </BottomNavigation>
  );
}
