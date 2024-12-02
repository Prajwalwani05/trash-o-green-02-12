import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import confirm from '../assets/confirm.gif';

const style = {
    display:'grid',
    placeItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '4px solid #38A12F',
  borderRadius:'10px',
  boxShadow: 24,
  p: 3,
};

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
   setOpen(true)
  },[])
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
          <img src={confirm} alt="Trash Truck Animation" width='70px'/>
            <Typography id="transition-modal-title" component="h5">
                YOUR PICKUP REQUEST HAS RECEIVED
            </Typography>
            <Typography mt={1} sx={{textAlign:'center', fontSize:'13px'}}>You can check your all bookings in Pickups section</Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
