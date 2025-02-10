//src\app\components\kiosk\loket\PilihLoket.js
import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const PilihLoket = ({
  selectedLoket,
  handleLoketChange,
  selectedService,
  handleServiceChange,
  waitingCounts,
  availableQueues,
  setSelectedQueue,
  selectedQueue,
  isLoketSelected,
}) => {
  const [queueList, setQueueList] = useState([]);

  useEffect(() => {
    if (selectedLoket && selectedService[selectedLoket] && availableQueues) {
      const serviceKey = selectedService[selectedLoket];
      const updatedQueueList = availableQueues[serviceKey] || [];
      setQueueList(updatedQueueList);
    }
  }, [selectedLoket, selectedService, availableQueues]);

  const handleQueueClick = (queueNumber) => {
    setSelectedQueue(queueNumber);
  };

  return (
    <Card style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>
        Pilih Loket
      </Typography>
      <Select
        value={selectedLoket}
        onChange={handleLoketChange}
        fullWidth
        style={{ marginBottom: "10px" }}
      >
        <MenuItem value="">Pilih Loket</MenuItem>
        {[1, 2, 3, 4].map((loket) => (
          <MenuItem key={loket} value={loket}>
            Loket {loket}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="h6" gutterBottom>
        Pilih Layanan untuk Loket {selectedLoket || "-"}
      </Typography>
      <ToggleButtonGroup
        value={selectedService[selectedLoket]}
        exclusive
        onChange={(event, newService) => handleServiceChange(selectedLoket, newService)}
        fullWidth
        disabled={!isLoketSelected} // Nonaktifkan jika loket belum dipilih
      >
        {["KB", "UB","KP", "UA", "UU"].map((serviceKey) => (
          <ToggleButton
            key={serviceKey}
            value={serviceKey}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              {serviceKey === "KB"
                ? "BPJS Karyawan (KB)"
                : serviceKey === "KP"
                ? "PJPK Karyawan (KP)"
                : serviceKey === "UB"
                ? "BPJS Umum (UB)"
                : serviceKey === "UA"
                ? "Asuransi Umum (UA)"
                : "Layanan Umum (UU)"}
            </div>
            <div
              style={{
                marginTop: "5px",
                padding: "3px 6px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                fontSize: "1em",
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              <span style={{ color: "blue", fontSize: "15px" }}>
                {waitingCounts[serviceKey]} WAITING
              </span>
            </div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {queueList.length > 0 && (
        <Box style={{ marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Nomor Antrean untuk {selectedService[selectedLoket]}
          </Typography>
          <Box
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Nomor Antrean
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queueList.map((queue, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleQueueClick(queue)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: queue === selectedQueue ? "#b3e5fc" : "transparent",
                    }}
                  >
                    <TableCell style={{ fontSize: "1.2rem" }}>{queue}</TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>Waiting</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default PilihLoket;
