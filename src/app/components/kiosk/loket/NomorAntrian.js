//src\app\components\kiosk\loket\NomorAntrian.js
import React from "react";
import { Card, Typography, Box } from "@mui/material";

const NomorAntrian = ({ calledQueue, selectedLoket }) => (
  <Card
    style={{
      padding: 20,
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      backgroundColor: "#e3f2fd",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Box>
      <Typography
        variant="h6"
        style={{
          color: "#1565c0",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Pemanggilan Antrian
      </Typography>
      <Typography
        variant="h2"
        className="scale"
        style={{
          color: "#0d47a1",
          fontWeight: "bold",
          fontSize: "4rem",
        }}
      >
        {calledQueue || "---"}
      </Typography>
      <Typography
        variant="h6"
        style={{
          color: "#1b5e20",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        Loket {selectedLoket || "-"}
      </Typography>
    </Box>
  </Card>
);

export default NomorAntrian;
