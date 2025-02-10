"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";
import axios from "axios";
import socket from "@/utils/socket";
import Image from "next/image";

// Default Axios Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";
axios.defaults.withCredentials = true;

const BackgroundBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage:
    "url(https://res.cloudinary.com/dk0z4ums3/image/upload/w_667,h_431,c_fill,dpr_2.0/v1558584329/hospital_image/1a7be54b7829_RS%20St.%20Carolus%20-%20Gedung%20All.jpg.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "rgba(0, 0, 0, 0.4)", // overlay effect
}));

const LoginBox = styled(Box)(({ theme }) => ({
  background: "#fff",
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  padding: "30px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  maxWidth: "80%", // Responsif untuk layar kecil
  width: "450px",
  height: "500px",
  margin: "auto", // Tambahkan ini
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#569A46",
  color: "#fff",
  fontWeight: "bold",
  marginTop: "40px",
  borderRadius: "25px",
  height: "50px",
  width: "80%",
  maxWidth: "300px",
  display: "block",
  margin: "20px auto",
  "&:hover": {
    backgroundColor: "#45a049",
    color: "#fff",
  },
  "&:disabled": {
    backgroundColor: "#cccccc",
    color: "#666666",
  },
}));

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateInput = () => {
    if (!username || username.length < 3) {
      return "Username harus diisi dan minimal 3 karakter.";
    }
    if (!password || password.length < 3) {
      return "Password harus diisi dan minimal 6 karakter.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
      const data = response.data;

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("id", data.user_id);
      localStorage.setItem("role", data.role);

      router.push(data.role === "admin" ? "/login/loket/admin" : "/login/loket");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "Tidak dapat terhubung ke server. Coba lagi nanti."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Terhubung ke server Socket.IO:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket.IO disconnected: ${reason}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <BackgroundBox>
      <Container>
        <LoginBox>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={250} // Lebar gambar dalam pixel
          height={100} // Tinggi gambar dalam pixel
          style={{
            marginBottom: "10px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
          <Typography
            variant="h4"
            component="h1"
            mb={2}
            fontWeight="bold"
            color="#BF1E2E"
          >
            Login
          </Typography>
          {error && (
            <Typography color="error" mb={1}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username/Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                maxWidth: "300px",
                margin: "10px auto",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                maxWidth: "300px",
                margin: "10px auto",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
            />
            <StyledButton type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </StyledButton>
          </form>
        </LoginBox>
      </Container>
    </BackgroundBox>
  );
};

export default Login;
