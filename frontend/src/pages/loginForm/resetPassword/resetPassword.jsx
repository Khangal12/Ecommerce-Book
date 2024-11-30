import React, { useState } from 'react';
import { Box, Grid, TextField, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';

const ResetPassword = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const handleUsernameChange = (event) => setUsername(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handleVerificationCodeChange = (event) => setVerificationCode(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
    const handleCheckboxChange = (event) => setRememberMe(event.target.checked);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Нууц үг давтан хийх талбарт зөвшөөрсөнтэй тохирохгүй байна.");
            return;
        }
        if (!email || !username || !password || !confirmPassword) {
            alert("Бүх талбарыг бөглөнө үү.");
            return;
        }
        console.log('Email:', email);
        console.log('Verification Code:', verificationCode);
        console.log('Password:', password);
        console.log('Remember Me:', rememberMe);
    };

    const handleVerificationCodeSubmit = () => {
        if (verificationCode === '12345') {
            alert('Баталгаажуулах код зөв байна!');
        } else {
            alert('Баталгаажуулах код буруу байна!');
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
                    <Typography variant="h5" gutterBottom align="center">
                        Нууц үгээ сэргээх
                    </Typography>


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

                    {/* Verification Code and Check Button on the Same Line */}
                    <Box sx={{
                        display: 'flex', 
                        alignItems: 'center', 
                        marginTop: 2
                    }}>
                        <TextField
                            id="verificationCode"
                            label="Баталгаажуулах код"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            sx={{ marginRight: 2 }}  // Space between the input and button
                        />

                        <Button 
                            variant="contained" 
                            onClick={handleVerificationCodeSubmit}
                        >
                            Шалгах
                        </Button>
                    </Box>

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

              

                    <Button variant="contained" fullWidth sx={{ marginTop: 2 }} onClick={handleSubmit}>
                        Үргэлжлүүлэх
                    </Button>

                    <Grid container spacing={1} sx={{ marginTop: 2 }} alignItems="center">
                        <Grid item xs={6}></Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <Box component="img" src="/assets/signUp.png" alt="Sign Up illustration" sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 2,
                        }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResetPassword;
