    import React, { useState } from 'react';
    import { Box, Grid, TextField, Button, FormControlLabel, Checkbox, Link, Typography } from '@mui/material';
    import useApi from '../../../useApi';
    import { Navigate, useNavigate } from 'react-router-dom';
    import ArrowBackIcon from '@mui/icons-material/ArrowBack';
    const SignUp = () => {
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [rememberMe, setRememberMe] = useState(true);
        const [phone_number,setPhoneNumber]=useState('');

        const {apiCallWithToast , loading} = useApi()
        const navigate=useNavigate();
        const handleUsernameChange = (event) => {
            setUsername(event.target.value);
        };

        const handleEmailChange = (event) => {
            setEmail(event.target.value);
        };

        const handlePasswordChange = (event) => {
            setPassword(event.target.value);
        };

        const handleConfirmPasswordChange = (event) => {
            setConfirmPassword(event.target.value);
        };

        const handleCheckboxChange = (event) => {
            setRememberMe(event.target.checked);
        };

        const handlePhoneNumberChange=(event)=>{
                setPhoneNumber(event.target.value);
        };
     
        const handleSubmit = async (event) => {
            event.preventDefault();
        
            // Create a new FormData object and append the data
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
           formData.append('phoneNumber', phone_number);
            
        
            try {
                const response = apiCallWithToast('http://127.0.0.1:5000/signUp/', {
                    method: 'POST',
                    data: formData, // Send the FormData object as the body
                });
                if(response.status===200){
                    navigate('./login')
                }
                
        
            } catch (error) {
                console.error('Error:', error);
                // Handle network error
            }
        };
        

        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: 2
            }}>
               
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                    <Link onClick={() => navigate(-1)} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <ArrowBackIcon />
                        <Typography variant="body1" sx={{ marginLeft: 1 }}>Буцах</Typography>
                    </Link>
                        <Typography variant="h5" gutterBottom align="center">
                            Бүртгүүлэх
                        </Typography>

                        {/* Username Field */}
                        <TextField
                            id="username"
                            label="Хэрэглэгчийн нэр"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={handleUsernameChange}
                        />

                        {/* Email Field */}
                        <TextField
                            id="email"
                            label="Имейл"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={handleEmailChange}
                        />
                          <TextField
                            id="phone_number"
                            label="Утасны дугаар"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={phone_number}
                            onChange={handlePhoneNumberChange}
                            
                        />

                        {/* Password Field */}
                        <TextField
                            id="password"
                            label="Нууц үг"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        
                          <TextField
                            id="confirm-password"
                            label="Нууц үг давтан хийх"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {/* Confirm Password Field */}
                      
                       
                    
                        <Button variant="contained" fullWidth sx={{ marginTop: 2 }} onClick={handleSubmit}>
                            Бүртгүүлэх
                        </Button>

                        <Grid container spacing={1} sx={{ marginTop: 2 }} alignItems="center">
                            <Grid item xs={6}>
                            
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/signUp.png"
                                alt="Login illustration"
                                sx={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: 2,
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    export default SignUp;
