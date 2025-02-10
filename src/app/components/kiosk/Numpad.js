import { useState,useEffect,useRef } from 'react';
import { Box, Grid, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';

const Numpad = () => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);


    const handleInputChange = (inputvalue) => {
        if (/^\d*$/.test(inputvalue)) {
          if (inputvalue.length > 13) {
            Swal.fire({
              icon: "warning",
              title: "Warning",
              text: "Maximum 13 digits allowed!",
              timer: 2000,
            });
          } else {
            setInputValue(inputvalue);
          }
        }
      };

    const handleKeyPress = (button) => {
        if (button === '{bksp}') {
            handleDelete();
        } else if (button === '{enter}') {
            handleSubmit();
        } else if (button === '{bersihkan}') {
            handleClear(); // Handle clear button press
        } else {
            handleButtonClick(button);
        }
    };

    const handleButtonClick = (inputvalue) => {
        if (inputValue.length < 13) {
            setInputValue((prev) => prev + inputvalue);
        }
    };

    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
        setInputValue('');
        window.location.reload(); // Reload the page to clear everything
    };

    const handleSubmit = () => {
        if (inputValue.length < 13) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimal Input 13 Digit',
                text: 'Silakan masukkan minimal 13 digit nomor antrean.',
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Antrean Terkirim',
            text: 'Silahkan tunggu panggilan antrean anda di loket!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            window.location.href = '/Dashboard';
        });

        setInputValue('');
    };

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Fokuskan input setelah komponen di-mount
      }
    }, []);

    return (
        <Box textAlign="center" p={2}>
            {/* Box untuk TextField */}
            <Box mb={2}>
                <TextField
                    label="Nomor Antrean"
                    variant="outlined"
                    ref={inputRef}
                    value={inputValue}
                    autoFocus
                    inputRef={inputRef} // Menggunakan ref untuk memastikan fokus
                    inputProps={{
                      maxLength: 13,
                      style: { textAlign: "center" },
                      autoComplete: "off",
                      inputMode: "numeric",
                    }}
                    onChange={(e) => handleInputChange(e.target.value)}
                    sx={{
                        boxShadow: '0px 4px 10px rgba(255, 0, 0, 0.5)',
                        borderRadius: '10px',
                        maxWidth: '430px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            height: '80px',
                        },
                        '& .MuiOutlinedInput-input': {
                            textAlign: 'center',
                            fontSize: '2rem',
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Box>

            {/* Numpad untuk memasukkan nomor antrean */}
            <Grid container spacing={2} justifyContent="center">
                {[
                    ['1', '2', '3'],
                    ['4', '5', '6'],
                    ['7', '8', '9'],
                    ['{bksp}', '0', '{enter}'],
                ].map((row, rowIndex) => (
                    <Grid container item xs={8} justifyContent="center" key={rowIndex} spacing={2}>
                        {row.map((button) => (
                            <Grid item xs={4} key={button}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleKeyPress(button)}
                                    sx={{
                                        backgroundColor: button === '{bksp}' ? '#ff4d4d' : button === '{enter}' ? '#4CAF50' : 'white',
                                        color: button === '{bksp}' ? 'white' : button === '{enter}' ? 'white' : 'rgba(0, 0, 0, 0.75)',
                                        borderRadius: '15px',
                                        fontSize: '2rem',
                                        fontFamily:'sans-serif',
                                        height: '100px', // Consistent height
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                        '&:hover': {
                                            backgroundColor: button === '{bksp}' ? '#ff6666' : button === '{enter}' ? '#66bb6a' : '#c0c0c0',
                                        },
                                    }}
                                    disabled={button === '{enter}' && inputValue.length < 13} // Disable Kirim button if less than 13 digits
                                >
                                    {button === '{bksp}' ? 'Hapus' : button === '{enter}' ? 'Kirim' : button}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                ))}
                {/* Clear Button Below Numeric Keypad */}
                <Grid container item xs={8} justifyContent="center" mt={1}>
                    <Grid item xs={8}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleClear} // Attach clear function to this button
                            sx={{
                                backgroundColor: '#ff9800', // Distinct color for clear button
                                color: '#fff',
                                borderRadius: '15px',
                                fontSize: '2rem',
                                height: '100px', // Consistent height
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#ffb74d', // Hover color for clear button
                                },
                            }}
                        >
                            Bersihkan
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Numpad;
