import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 14,
  p: 4,
};

const JOB_TITLES = [
  'Software Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'Technical Support',
];

export default function InterviewerDetails() {
  const [selectedJobRole, setselectedJobRole] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!selectedJobRole) {
      toast.error('Please select job role.')
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Job Description is required.')
      return;
    }
    const sessionId = crypto.randomUUID();
    navigate(`/demo/${sessionId}`, {
      state: { selectedJobRole, jobDescription },
    });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Personal Details
        </Typography>
        <Typography sx={{ mt: 2 }}>Desired Role</Typography>
        <Autocomplete
          disablePortal
          options={JOB_TITLES}
          value={selectedJobRole}
          onChange={(_, newValue) => setselectedJobRole(newValue)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Select Role" />}
        />

        <Typography sx={{ mt: 2 }}>Job Description</Typography>
        <TextField
          fullWidth
          multiline
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={4}
          placeholder="Enter job description..."
          sx={{ mt: 1 }}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <ToastContainer />
    </React.Fragment>
  );
}
