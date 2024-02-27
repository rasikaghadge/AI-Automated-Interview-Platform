import React, { useState } from 'react';
import axios from 'axios';
import styles from "./UserDetails.module.css";

const UserDetails = () => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {


      // Make a POST request to your Django API endpoint
      const response = await axios.post('http://localhost:8000/user/', {
        role,
        experience,
        skills,
      });

      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Role:
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
      </label>
      <br />
      <label>
        Experience:
        <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} />
      </label>
      <br />
      <label>
        Skills:
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserDetails;
