"use client"; // Pastikan komponen ini dirender di sisi klien

import React from "react";
import Typography from "@mui/material/Typography";
import Image from "next/image"; // Import komponen Image dari Next.js
import logo from "../../../../public/images/logo.png"; // Sesuaikan path logo Anda

const GenerateAntrianPrint = React.forwardRef((props, ref) => {
  console.log("Props:", props);

  return (
    <div ref={ref} className="print-source page">
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1mm" }}>
        <Image
          src={logo}
          width={168} // Set width untuk menggantikan inline style pada <img>
          height={56} // Set height untuk menggantikan inline style pada <img>
          alt="Logo"
          priority // Opsional: Optimasi gambar untuk lebih cepat dimuat
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1mm" }}>
        <Typography
          style={{
            fontSize: "4mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Antrian
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottomWidth: ".2mm",
          borderBottomStyle: "solid",
          borderBottomColor: "#000000",
          padding: "0mm 0mm 2mm 0mm",
        }}
      >
        <Typography
          style={{
            fontSize: "4mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {props.namaSub}
        </Typography>
      </div>

      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "1mm" }}>
        <Typography
          style={{
            fontSize: "4mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          No. Antrian
        </Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "2mm" }}>
        <Typography
          style={{
            fontSize: "15mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          {props.queueNumber}
        </Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: ".4mm", marginLeft: "1mm" }}>
        <Typography
          style={{
            fontSize: "3.5mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          Silahkan ke {props.location === "" ? "-" : props.location}
        </Typography>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "4mm" }}>
        <Typography
          style={{
            fontSize: "3.5mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          Waktu Pengambilan: {props.waitingStamp || "-"}
        </Typography>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "2mm" }}>
        <Typography
          style={{
            fontSize: "3mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          ©2024 Powered By : SIRS Development Team
        </Typography>
        <Typography
          style={{
            fontSize: "3mm",
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          {props.strTime} {props.strDate}
        </Typography>
      </div>
    </div>
  );
});

// Tambahkan displayName untuk mengatasi error "Component definition is missing display name"
GenerateAntrianPrint.displayName = "GenerateAntrianPrint";

export default GenerateAntrianPrint;
