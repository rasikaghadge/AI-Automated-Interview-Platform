import { IconButton, InputAdornment, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

import React from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



const Field = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword, placeholder }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      InputProps={name === 'password' ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword}>
              {type === 'password' ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : null}
    />
  </Grid>
);

export default Field
