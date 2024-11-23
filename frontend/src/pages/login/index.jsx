
import React, { useState } from 'react';
import { Box, Grid, TextField, Button, FormControlLabel, Checkbox, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import loginPhoto from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const navigate = useNavigate(); 

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setRememberMe(event.target.checked);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Remember Me:', rememberMe);
    };
    const handleSignUpRedirect = () => {
        navigate('/signUp');  
    };
    const handleResetPassword=()=>{
        navigate('/resetPassword')
    }
    return (
        <Box sx={{
            display: 'flex',      
            justifyContent: 'center',  // Horizontally center the content
            alignItems: 'center',   // Vertically center the content
            minHeight: '100vh',      // Take full height of the viewport
            padding: 2
        }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h5" gutterBottom align="center">
                        Нэвтрэх
                    </Typography>

                    <Box sx={{ padding: 2 }}>
                        {/* Google Button */}
                        <Button variant="outlined" sx={{ marginBottom: 1 }} fullWidth>
                            <GoogleIcon sx={{ marginRight: 1 }} />
                            Google
                        </Button>

                        {/* Facebook Button */}
                        <Button variant="outlined" fullWidth>
                            <FacebookIcon sx={{ marginRight: 1 }} />
                            Facebook
                        </Button>
                    </Box>

                    <TextField
                        id="username"
                        label="Нэвтрэх нэр"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={handleUsernameChange}
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


                    <Button variant="contained" fullWidth sx={{ marginTop: 2 }} onClick={handleSubmit}>
                        Нэвтрэх
                    </Button>


                    <Grid container spacing={1} sx={{ marginTop: 2 }} alignItems="center">
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Сануулах"
                                sx={{ marginTop: 1 }}
                            />
                        </Grid>
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Link href="#" variant="body2" onClick={handleResetPassword}>
                                Нууц үгээ мартсан уу?
                            </Link>
                        </Grid>
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                            Бүртгэл үүсгэж амжаагүй байна уу ?<Link href="#" onClick={handleSignUpRedirect} variant="body2">Энд дарж бүртгүүлээрэй</Link>
                        </Typography>
                    </Grid>
                </Grid>

                {/* Image Grid Item */}
                <Grid item xs={12} sm={6} md={4}>
                    {/* Center the image using Flexbox */}
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
                            src={loginPhoto}
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

export default Login;
