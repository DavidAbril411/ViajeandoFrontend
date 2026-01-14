import React, { useState } from 'react';
import { TextField, Button, Checkbox, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useLocation } from "wouter";
function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [, setLocation] = useLocation();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    async function handleLogin() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contraseña: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);  // Mensaje de éxito
                setErrorMessage('');
                if (data.token) {
                    console.log(data.token)
                    localStorage.setItem('authToken', data.token);
                    setTimeout(() => setLocation("/"), 100);
                } else {
                    setErrorMessage('No se recibió un token válido.');
                }
            } else {
                setErrorMessage(data.message);  // Mensaje de error
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Ocurrió un error. Intenta nuevamente.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="fixed inset-0 bg-[#999999] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl text-center shadow-lg relative flex flex-col gap-5 w-full max-w-[589px] h-full sm:h-auto justify-center">
                <div>
                    <Link href={"/"} className="flex justify-center">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M88.047 11.5543C87.1924 11.5543 88.9648 11.3442 88.1102 11.3442C88.1102 11.3442 88.3042 11.5038 87.8854 11.4497C86.9283 11.9682 89.3895 11.3126 88.5776 11.511C88.5776 11.511 88.4571 11.3541 88.0384 11.3C87.0813 11.713 88.8067 11.2693 87.9948 11.4677C88.1239 11.8131 93.7436 9.84459 88.6845 11.4587C87.8299 11.4587 11.4589 31.9263 10.6044 31.9263C10.6044 31.9263 9.54468 33.0273 10.5967 31.9443C9.85831 32.5367 15.6327 30.617 10.8642 32.2491C10.0096 32.2491 11.7811 32.2491 10.9265 32.2491C10.9265 32.2491 11.1812 32.3609 10.7625 32.3068C10.5403 33.5602 11.67 31.8911 10.8582 32.0895C10.8582 32.0895 10.9257 32.0426 10.8086 31.9885C10.2847 32.2365 11.7717 31.8875 10.9599 32.0859C10.9599 32.0859 11.1188 31.9659 10.7086 31.8848C10.2386 32.7955 11.7324 31.6747 10.8607 32.1797C10.8607 32.1797 10.5078 31.7342 10.5591 32.176C11.3786 33.2762 39.3612 48.7481 39.5569 48.7148C39.5962 48.9357 38.9433 48.3198 39.4509 48.7166C40.5533 49.1133 39.6526 47.4415 39.4731 48.722C39.7663 57.1081 38.8339 74.5936 38.8826 77.4034C40.1559 78.5577 37.364 77.4783 38.757 77.4873C42.4744 72.2392 54.6301 61.5987 55.0992 61.0352C55.236 61.2353 71.8235 76.5098 71.791 76.6992C72.6456 76.6992 70.9544 76.6992 71.809 76.6992C73.6463 70.4141 91.214 13.1233 91.3277 12.1233C91.3277 11.6724 91.2508 12.6282 91.3277 12.1954C91.5157 11.8744 91.2559 11.9519 91.4285 12.2513C91.2747 11.584 90.4885 11.6904 91.3004 11.6093C91.3004 11.6093 91.8986 12.0439 91.479 11.9592C91.3952 11.942 91.5781 12.4145 91.0559 12.1025C92.2267 11.1557 91.6097 12.4849 91.1568 11.9799C91.2662 11.3153 90.8679 11.9294 91.2192 11.8239C91.2192 11.8239 91.4696 11.9096 91.4867 11.4587C91.5473 11.7301 91.2815 11.8897 91.3704 11.5705C91.2807 11.4939 91.1918 12.9457 91.1918 11.4398C90.0552 11.4398 88.9101 11.4398 87.7735 11.4398C86.9001 11.9231 88.7315 11.5867 88.4683 11.7644M85.6635 15.9385C84.8875 16.5652 86.8069 15.411 85.6481 16.0269C85.4131 16.2568 85.5362 16.007 85.7532 15.787C85.5251 15.998 85.5396 16.0359 85.5097 16.0503C85.4464 16.0801 40.4986 43.4108 40.0491 43.6732C39.3868 44.2142 40.2149 43.7823 40.0252 43.5469C39.2219 43.0329 19.8612 33.6432 18.8528 33.7784C18.0495 33.2644 19.2741 33.3095 18.2657 33.4448C17.7188 31.6143 17.2308 33.232 18.3503 33.2861C19.2758 32.8289 64.9389 20.8629 85.543 16.0116C85.8336 16.0134 85.5054 15.9538 85.5285 15.9935C85.4063 15.9547 85.643 16.0431 85.6302 16.0873M70.5903 71.7009C70.5903 72.1517 70.7014 71.562 70.5903 71.9768C70.61 72.0102 71.0441 71.4799 70.827 71.856C70.6091 71.7469 52.7739 54.1766 52.7354 53.8213C53.0388 53.3857 53.7054 51.9971 52.9687 53.3028C52.6457 53.8763 52.444 54.31 52.732 54.0458C53.8131 53.0539 85.5669 21.0513 86.0464 20.486C86.7523 19.6528 80.3471 23.1443 86.0643 20.4571C82.3041 32.0805 70.2801 71.103 70.2989 71.6278M75.27 26.2111C74.7026 26.8793 75.7452 25.78 75.1273 26.3184C74.6727 26.8784 77.6697 24.2994 75.123 26.193C73.0635 27.194 75.5828 25.9802 75.0572 26.3148C74.5676 26.9207 46.6696 55.1865 42.4804 59.2317C42.4804 58.33 42.1788 60.0432 42.1788 59.1415C41.7874 59.3201 44.8758 57.4282 42.33 59.2623C42.3727 58.8205 42.43 47.1971 42.43 47.1971C52.1706 40.0085 74.4351 26.3409 74.9547 25.8675C75.3837 25.4771 76.7579 25.9911 75.1854 26.1263M42.5026 63.4924C42.7154 62.9324 49.7931 57.2686 50.1392 56.448C50.3477 57.3976 49.7957 57.0468 50.1717 56.4688C50.7861 56.467 50.7537 58.8656 49.7077 61.1659C48.2531 64.3635 42.5317 69.0516 42.4488 68.7531C42.2531 68.0489 42.465 63.5339 42.5026 63.4924Z" fill="#3BC4FA" fillOpacity="0.95" />
                            <path d="M43.4165 87.7409C43.4165 87.7409 43.8342 85.1721 43.3279 87.7065C43.4929 87.7883 43.2816 87.7621 45.1858 90.3257C45.1858 90.3257 44.8883 90.251 45.2093 90.0762C46.2309 88.6096 58.4827 76.7014 59.4002 75.5175C60.1488 74.5528 57.9512 75.0589 58.3746 73.7266C57.2839 73.967 45.3613 86.0944 43.4165 87.7409Z" fill="#3BC4FA" fillOpacity="0.9" />
                            <path d="M13.5434 85.2762C13.5434 85.2762 13.9384 82.9479 13.4597 85.2438C13.6158 85.3176 13.415 85.2944 15.2176 87.6166C15.2176 87.6166 14.9364 87.5479 15.2396 87.3903C16.2067 86.062 27.7985 75.2751 28.6665 74.2033C29.3744 73.3286 27.2955 73.7872 27.6961 72.5801C26.664 72.7993 15.3834 83.7832 13.5434 85.2762Z" fill="#3BC4FA" fillOpacity="0.9" />
                            <path d="M11.974 63.2073C11.974 63.2073 12.3901 60.881 11.8862 63.176C12.0504 63.2497 11.8399 63.2265 13.736 65.5487C13.736 65.5487 13.4401 65.481 13.7595 65.3235C14.7771 63.9942 26.976 53.2072 27.8895 52.1355C28.6348 51.2617 26.4461 51.7193 26.8679 50.5122C25.7821 50.7304 13.9107 61.7164 11.974 63.2073Z" fill="#3BC4FA" fillOpacity="0.9" />
                        </svg>
                    </Link>
                    <div className='py-[16px]'>
                        <Typography variant="h5" className="font-semibold text-start">
                            Log In
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 text-start">
                            Get your trip for free
                        </Typography>
                    </div>
                </div>

                {/* Email */}
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    className="mt-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                />

                {/* Password */}
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    size="medium"
                    className="mt-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errorMessage}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <button
                                    type="button"
                                    className="ml-2 text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            ),
                        }
                    }}
                />

                {/* Error or Success Message */}
                {errorMessage && (
                    <Typography variant="body2" className="text-red-500 mt-2">
                        {errorMessage}
                    </Typography>
                )}
                {successMessage && (
                    <Typography variant="body2" className="text-green-500 mt-2">
                        {successMessage}
                    </Typography>
                )}

                {/* Checkbox */}
                <div className="flex items-center justify-start">
                    <Checkbox />
                    <Typography variant="body2" className="text-gray-600">
                        Remember me
                    </Typography>
                </div>

                {/* Botón Sign In */}
                <Button
                    variant="contained"
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    onClick={handleLogin}
                >
                    Sign In
                </Button>

                {/* Links de ayuda */}
                <Typography variant="body2" className="text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Sign Up
                    </a>{' '}
                    |{' '}
                    <a href="/forgot-password" className="text-blue-500 hover:underline">
                        Forgot your password?
                    </a>
                </Typography>
            </div>
        </div>
    );
}

export default Login;
