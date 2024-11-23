import React, { useState } from 'react';
import { Box, Grid, TextField, Button, FormControlLabel, Checkbox, Link, Typography } from '@mui/material';
import SignUpPhoto from '../assets/signUp.png';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
        console.log('Remember Me:', rememberMe);
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

                    {/* Confirm Password Field */}
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
                       <FormControlLabel
                                control={<Checkbox checked={rememberMe} onChange={handleCheckboxChange} />}
                                label="Гэрээг зөвшөөрч байна"
                                sx={{ marginTop: 1 }}
                            />
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
                            src={SignUpPhoto}
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
