import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const JOB_TITLES = [
  "Software Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "Technical Support"
];

export default function InterviewerDetails({ isModelOpen, handleUserInputJobPreference }) {
  const [open, setOpen] = React.useState(isModelOpen);
  const [selectedJobRole, setselectedJobRole] = React.useState(null)
  const [jobDescription, setJobDescription] = React.useState(null)

  React.useEffect(() => {
    setOpen(isModelOpen);
  }, [isModelOpen]);

  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    if (selectedJobRole === null) {
        alert("Job Role is required")
    }
    if (jobDescription === null) {
        alert("Job Description is required")
    }
    handleUserInputJobPreference({jobRole: selectedJobRole, jobDescription: jobDescription})
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Personal Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Desired Role
          </Typography>
          <Autocomplete
            disablePortal
            aria-required
            options={JOB_TITLES}
            value={selectedJobRole}
            onChange={(event) => setselectedJobRole(event.target.value)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select Role" />}
          />
          <Typography id="job-description" sx={{ mt: 2 }}>
            Job Description
          </Typography>
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
      </Modal>
    </div>
  );
}
