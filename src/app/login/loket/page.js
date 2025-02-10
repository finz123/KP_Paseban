    //src\app\login\loket\page.js
    "use client";

    import React, { useState, useEffect, useCallback } from "react";
    import { Grid } from "@mui/material";
    import axios from "axios";
    import Header from "@/app/components/kiosk/Header";
    import Footer from "@/app/components/kiosk/footer";
    import DaftarAntrian from "@/app/components/kiosk/loket/DaftarAntrian";
    import MenuDropdown from "@/app/components/kiosk/loket/MenuDropdown";
    import MovingText from "@/app/components/kiosk/loket/MovingText";
    import NomorAntrian from "@/app/components/kiosk/loket/NomorAntrian";
    import PilihLoket from "@/app/components/kiosk/loket/PilihLoket";
    import TombolAksi from "@/app/components/kiosk/loket/TombolAksi";
    import ResetButton from "@/app/components/kiosk/ResetButton";
    import Swal from "sweetalert2";
    import { useRouter } from "next/navigation";
    import socket from "@/utils/socket";

   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.6.79:3100";

    export default function QueueDashboard() {
      const router = useRouter();
      
      // Hanya gunakan satu kali inisialisasi state
      const [queues, setQueues] = useState({ KB: 1, KP: 1, UB: 1, UA: 1, UU: 1 });
      const [pendingQueues, setPendingQueues] = useState([]);
      const [currentQueue, setCurrentQueue] = useState({});
      const [completedQueues, setCompletedQueues] = useState([]);
      const [greeting, setGreeting] = useState('');
      const [username, setUsername] = useState('');
      const [selectedService, setSelectedService] = useState({});
      const [selectedLoket, setSelectedLoket] = useState("");
      const [isLoketSelected, setIsLoketSelected] = useState(false); // Status apakah loket dipilih
      const [calledQueue, setCalledQueue] = useState(null);
      const [lastCalledQueue, setLastCalledQueue] = useState(null);
      const [availableQueues, setAvailableQueues] = useState({});
      const [callAttemptsPerQueue, setCallAttemptsPerQueue] = useState({});
      const [waitingCounts, setWaitingCounts] = useState({
        KB: 0,
        KP: 0,
        UB: 0,
        UA: 0,
        UU: 0,
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [role, setRole] = useState('');
    const [isNextQueueButtonDisabled, setIsNextQueueButtonDisabled] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isViewingPending, setIsViewingPending] = useState(true);
    const [calledQueues, setCalledQueues] = useState([]);
    const [isLockedDuringService, setIsLockedDuringService] = useState(false);
    const [isServiceActive, setIsServiceActive] = useState(false); // Menentukan apakah layanan sedang aktif
    const [selectedQueue, setSelectedQueue] = useState(null); // State untuk antrean yang dipilih
    const [isCallEnabled, setIsCallEnabled] = useState(true); // Enable Panggil Nomor button
    const [isStartEnabled, setIsStartEnabled] = useState(false); // Enable Start Layanan button after calling
    const [isCompleteEnabled, setIsCompleteEnabled] = useState(false); // Enable Selesaikan Layanan after starting service
    const [isAllButtonsDisabled, setIsAllButtonsDisabled] = useState(false); // Disable semua tombol saat layanan berjalan
    const [isOtherButtonsDisabled, setIsOtherButtonsDisabled] = useState(false);

    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedQueues = JSON.parse(localStorage.getItem('queues')) || { KB: 1, KP: 1, UB: 1, UA: 1, UU: 1 };
          const storedPendingQueues = JSON.parse(localStorage.getItem('pendingQueues')) || [];
          console.log('Loaded pending queues from localStorage:', storedPendingQueues);
          const storedCurrentQueue = JSON.parse(localStorage.getItem('currentQueue')) || {
            1: 'KB-001',
            2: 'UB-001',
            3: 'UA-001',
            4: 'UU-001',
          };

          setQueues(storedQueues);
          setPendingQueues(storedPendingQueues);
          setCurrentQueue(storedCurrentQueue);
        }
      }, []);

      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem("token"); // Ambil token
      
            if (!token) {
              console.warn("Token tidak ditemukan. Redirect ke halaman login.");
              router.push("/login");
              return;
            }
      
            // Panggil endpoint untuk mendapatkan profil pengguna
            const response = await axios.get(`${BASE_URL}/auth/me`, {
              headers: {
                "x-token": token, // Sertakan token di header
                "Content-Type": "application/json",
              },
            });
      
            console.log("Response from /auth/me:", response.data);
      
            if (response.status === 200) {
              const data = response.data;
      
              // Simpan `id` di localStorage
              localStorage.setItem("id", data.id);
              console.log("ID saved to localStorage:", data.id);
      
              // Simpan data lainnya ke state
              setUsername(data.username);
              setRole(data.role);
            } else {
              throw new Error("Gagal mengambil data pengguna.");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            Swal.fire("Error", "Token kadaluwarsa. Silakan login kembali.", "error");
            router.push("/login");
          }
        };
      
        fetchUserData();
      }, [router]);      
      
       
      useEffect(() => {
        const updateGreeting = () => {
          const hour = new Date().getHours();
          setGreeting(hour < 10 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam');
        };
        updateGreeting();
        const intervalId = setInterval(updateGreeting, 60000);
        return () => clearInterval(intervalId);
      }, []);
    
      useEffect(() => {
        localStorage.setItem('queues', JSON.stringify(queues));
      }, [queues]);
    
      useEffect(() => {
        // Menyimpan antrean pending ke localStorage setiap kali ada perubahan
        console.log('Saving pending queues to localStorage:', pendingQueues);
        localStorage.setItem('pendingQueues', JSON.stringify(pendingQueues));
      }, [pendingQueues]);

      useEffect(() => {
        localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
      }, [currentQueue]);

      // Fungsi baru untuk memanggil API dan mengisi antrean pending
      const fetchQueueList = useCallback(async () => {
        setIsFetching(true); // Mulai proses fetching
        try {
            const response = await axios.get(`${BASE_URL}/antrean/list`);
            if (response.status !== 200) throw new Error('Failed to fetch queue list');
            const data = response.data; // Ambil data dari respons axios

            console.log('Data fetched from API:', data); // Debugging output
    
            const startOfDay = new Date().setHours(0, 0, 0, 0); // 00:00:00 waktu lokal
          const endOfDay = new Date().setHours(23, 59, 59, 999); // 23:59:59 waktu lokal

    
          const categorizedData = {
            KB: data.filter(
                (queue) =>
                    queue.nomorAntrean.startsWith('KB') &&
                    queue.status === 'waiting' &&
                    new Date(queue.waiting_stamp).getTime() >= startOfDay &&
                    new Date(queue.waiting_stamp).getTime() <= endOfDay
            ),
            UB: data.filter(
                (queue) =>
                    queue.nomorAntrean.startsWith('UB') &&
                    queue.status === 'waiting' &&
                    new Date(queue.waiting_stamp).getTime() >= startOfDay &&
                    new Date(queue.waiting_stamp).getTime() <= endOfDay
            ),
            KP: data.filter(
                (queue) =>
                    queue.nomorAntrean.startsWith('KP') &&
                    queue.status === 'waiting' &&
                    new Date(queue.waiting_stamp).getTime() >= startOfDay &&
                    new Date(queue.waiting_stamp).getTime() <= endOfDay
            ),
            UA: data.filter(
                (queue) =>
                    queue.nomorAntrean.startsWith('UA') &&
                    queue.status === 'waiting' &&
                    new Date(queue.waiting_stamp).getTime() >= startOfDay &&
                    new Date(queue.waiting_stamp).getTime() <= endOfDay
            ),
            UU: data.filter(
                (queue) =>
                    queue.nomorAntrean.startsWith('UU') &&
                    queue.status === 'waiting' &&
                    new Date(queue.waiting_stamp).getTime() >= startOfDay &&
                    new Date(queue.waiting_stamp).getTime() <= endOfDay
            ),
        };
    
            console.log('Filtered categorized data:', categorizedData);
    
            setWaitingCounts({
                KB: categorizedData.KB.length,
                KP: categorizedData.KP.length,
                UB: categorizedData.UB.length,
                UA: categorizedData.UA.length,
                UU: categorizedData.UU.length,
            });
    
             // Filter antrean dengan status tertentu dan tanggal hari ini
             const waitingOrCalledQueues = data.filter(
              (queue) =>
                  !queue.complete_stamp &&
                  (
                      (queue.status === 'waiting' && new Date(queue.waiting_stamp).getTime() >= startOfDay && new Date(queue.waiting_stamp).getTime() <= endOfDay) ||
                      (queue.status === 'called' && new Date(queue.called_stamp).getTime() >= startOfDay && new Date(queue.called_stamp).getTime() <= endOfDay) ||
                      (queue.status === 'recalled' && new Date(queue.waiting_stamp).getTime() >= startOfDay && new Date(queue.waiting_stamp).getTime() <= endOfDay) ||
                      (queue.status === 'processed' && new Date(queue.processed_stamp).getTime() >= startOfDay && new Date(queue.processed_stamp).getTime() <= endOfDay)
                  )
          );
            
          const pendingFromServer = data.filter(
            (queue) =>
                queue.status === 'pending' &&
                new Date(queue.no_show_stamp).getTime() >= startOfDay &&
                new Date(queue.no_show_stamp).getTime() <= endOfDay &&
                queue.complete_stamp === null
        );
      
        const calledOrRecalledFromServer = data.filter((queue) => {
          const queueTime = new Date(queue.called_stamp || queue.processed_stamp || queue.waiting_stamp).getTime();
          return (
              (queue.status === 'called' || queue.status === 'recalled' || queue.status === 'processed') &&
              queueTime >= startOfDay &&
              queueTime <= endOfDay &&
              queue.complete_stamp == null
          );
      });
      
            
            console.log("Antrean lolos filter:", calledOrRecalledFromServer);
            
            // Perbarui state
            setCalledQueues(calledOrRecalledFromServer);
            
            // Debug hasil
            console.log('Filtered Called/Recalled/Processed Queues for Today:', calledOrRecalledFromServer);            

         const completedFromServer = data.filter(
              (queue) =>
                  queue.status === 'completed' &&
                  new Date(queue.complete_stamp).getTime() >= startOfDay &&
                  new Date(queue.complete_stamp).getTime() <= endOfDay
          );
    
            // Gabungkan antrean pending dari server dengan antrean pending lokal
            const mergedPendingQueues = Array.from(
              new Set([
                ...pendingQueues,
                ...pendingFromServer.filter((queue) => !queue.complete_stamp) // Hanya tambahkan antrean yang belum pernah selesai
              ])
            );
            
    
            // Perbarui state antrean yang sudah completed
            setCompletedQueues(completedFromServer);
    
            // Perbarui state untuk antrean `called` dan `recalled`
            setCalledQueues(calledOrRecalledFromServer);
    
            // Update available queues
            setAvailableQueues(
              waitingOrCalledQueues.reduce((acc, queue) => {
                const serviceType = queue.nomorAntrean?.slice(0, 2); // Pastikan nomorAntrean ada
                if (!serviceType || queue.complete_stamp) { // Abaikan antrean yang sudah selesai
                  console.warn("Queue missing serviceType or already completed:", queue);
                  return acc; // Abaikan antrean yang tidak valid
                }
                if (!acc[serviceType]) {
                  acc[serviceType] = [];
                }
                acc[serviceType].push(queue.nomorAntrean);
                return acc;
              }, {})
            );            
    
            // Perbarui state pendingQueues hanya jika ada perubahan
            const isDataDifferent =
      JSON.stringify(pendingFromServer) !== JSON.stringify(pendingQueues);

    if (isDataDifferent) {
      console.log('Pending queues updated:', pendingFromServer);
      setPendingQueues(pendingFromServer);
    }
  } catch (error) {
    console.error('Error fetching queue list:', error);
  } finally {
    setIsFetching(false);
  }
}, [pendingQueues]);
      
      // Gunakan fetchQueueList di useEffect
      useEffect(() => {
        fetchQueueList();
      }, [fetchQueueList]); 

      useEffect(() => {
        console.log('Current pending queues:', pendingQueues);
      }, [pendingQueues]);
    
      // Tambahkan polling
      useEffect(() => {
        const intervalId = setInterval(fetchQueueList, 60000); // Interval 30 detik
        return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
    }, [fetchQueueList]);

    // Perbarui handleLoketChange agar menerima event dengan benar dari Select
    const handleLoketChange = async (event) => {
      const newLoketId = event.target.value; // Loket tujuan
      const userId = localStorage.getItem("id"); // ID user yang sedang login
      const currentLoketId = selectedLoket; // Loket lama yang dipilih sebelumnya
    
      if (!newLoketId) {
        Swal.fire("Error", "Pilih Loket terlebih dahulu.", "error");
        return;
      }
    
      try {
        // 1. Hapus user dari loket lama (jika ada loket lama yang dipilih)
        if (currentLoketId) {
          await axios.post(
            `${BASE_URL}/loket/clear`,
            { loketId: currentLoketId },
            {
              headers: {
                "Content-Type": "application/json",
                "x-token": localStorage.getItem("token"),
              },
            }
          );
          console.log(`User dihapus dari Loket ${currentLoketId}`);
        }
    
        // 2. Assign user ke loket baru
        const response = await axios.post(
          `${BASE_URL}/loket/assign`,
          { loketId: parseInt(newLoketId), userId: parseInt(userId) },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem("token"),
            },
          }
        );
    
        if (response.status === 200) {
          Swal.fire({
            title: "Berhasil",
            text: `Berhasil berpindah ke Loket ${newLoketId}.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true,
          });

          // Emit ke server bahwa operator pindah loket
      socket.emit("loketChange", {
        userId,
        loketId: newLoketId,
      });

          setSelectedLoket(newLoketId); // Update state loket yang dipilih
          setIsLoketSelected(true);
        } else {
          Swal.fire("Error", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error changing loket:", error);
        Swal.fire("Error", "Terjadi kesalahan saat berpindah loket.", "error");
      }
    };

    const handleServiceChange = (loket, newService) => {
      // Pastikan antrean hanya dari yang tersedia dalam `availableQueues`
      const availableQueueNumbers = availableQueues[newService];
      if (availableQueueNumbers && availableQueueNumbers.length > 0) {
        setSelectedService({ ...selectedService, [loket]: newService });
        setCurrentQueue({
          ...currentQueue,
          [loket]: availableQueueNumbers[0], // Ambil antrean pertama yang tersedia
        });
        
      } else {
        Swal.fire('Tidak Ada Antrean', `Tidak ada nomor antrean yang tersedia untuk layanan ${newService}.`, 'info');
      }
      
  };
      
  const handleCallQueue = async () => {
    if (!selectedQueue || !selectedLoket) {
      Swal.fire("Pilih Nomor dan Loket", "Silakan pilih nomor antrean dan loket terlebih dahulu.", "warning");
      return;
    }
  
    try {
      // 1. Ubah status antrean menjadi 'called'
      const statusResponse = await axios.patch(`${BASE_URL}/antrean/status`, {
        nomorAntrean: selectedQueue,
        status: "called",
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-token": localStorage.getItem("token"), // Token autentikasi
        },
      });
      
      socket.emit("queueCalled", {
        nomorAntrean: selectedQueue,
        loket: selectedLoket,
      });
      
      // 2. Update loket pada antrean
      const loketResponse = await axios.patch(`${BASE_URL}/antrean/loket`, {
        nomorAntrean: selectedQueue,
        loket: `Loket ${selectedLoket}`,
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-token": localStorage.getItem("token"),
        },
      });
  
      if (statusResponse.status === 200 && loketResponse.status === 200) {
        Swal.fire({
          title: "Berhasil",
          text: `Nomor ${selectedQueue} dipanggil di Loket ${selectedLoket}.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
  
        // Update state setelah sukses
        setCalledQueue(selectedQueue);
        setLastCalledQueue(selectedQueue);
        setIsCallEnabled(false);
        setIsStartEnabled(true);
      }
    } catch (error) {
      console.error("Error calling queue:", error);
      Swal.fire("Error", "Gagal memanggil nomor antrean. Silakan coba lagi.", "error");
    }
  };
  
    
  const handleCancelAllPendingQueues = async () => {
    if (pendingQueues.length === 0) {
      Swal.fire('Tidak Ada Antrian', 'Tidak ada antrean pending untuk diselesaikan.', 'info');
      return;
    }
  
    try {
      const promises = pendingQueues.map(async (queue) => {
        const queueNumber = typeof queue === 'string' ? queue : queue.nomorAntrean;
  
        const response = await axios.patch(`${BASE_URL}/antrean/status`, {
          nomorAntrean: queueNumber,
          status: "cancelled",
        });
  
        if (response.status !== 200) {
          throw new Error(`Gagal memperbarui antrean ${queueNumber}: ${response.data.message}`);
        }
      });
  
      await Promise.all(promises);
  
      Swal.fire({
        title: "Antrian Diselesaikan",
        text: "Semua antrean pending berhasil diperbarui menjadi cancelled.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
  
      // Kosongkan antrean pending di UI
      setPendingQueues([]);
    } catch (error) {
      console.error("Error completing pending queues:", error);
      Swal.fire("Error", error.response?.data?.message || "Terjadi kesalahan saat memperbarui antrean.", "error");
    }
  };
  
  
                    
    const handlePendingQueue = async () => {
      const currentAntrian = calledQueue;
    
      if (!currentAntrian) {
        Swal.fire(
          'Nomor Antrian Tidak Tersedia',
          'Tidak ada nomor antrean yang tersedia untuk dipindahkan ke pending.',
          'error'
        );
        return;
      }
    
      try {
        // Perbaikan endpoint dan body request
        await axios.patch(`${BASE_URL}/antrean/status`, {
          nomorAntrean: currentAntrian, // Sesuaikan nama field dengan backend
          status: 'pending', // Status baru sesuai dengan backend
        });
    
        Swal.fire({
          title: 'Nomor Antrian Dipindahkan ke Pending',
          text: `${currentAntrian} berhasil dipindahkan ke daftar pending.`,
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        // Emit ke server untuk mengupdate status antrean
    socket.emit("queuePending", {
      nomorAntrean: currentAntrian,
    });

    
    setPendingQueues((prevQueues) => {
      if (prevQueues.some(queue => queue === currentAntrian)) {
        return prevQueues; // Jangan tambahkan jika duplikat
      }
      return [...prevQueues, currentAntrian];
    });

        setCalledQueue(null);
        setLastCalledQueue(null);
    
        setIsCallEnabled(true); // Aktifkan kembali tombol "Panggil Nomor"
        setIsServiceActive(false); // Nonaktifkan mode layanan
        setIsOtherButtonsDisabled(false); // Aktifkan kembali tombol lainnya
        setIsLockedDuringService(false); // Buka kunci layanan
      } catch (error) {
        console.error('Error updating queue to pending:', error);
        Swal.fire(
          'Gagal Memindahkan ke Pending',
          'Terjadi kesalahan saat memindahkan antrean.',
          'error'
        );
      }
    };
  
    const fetchPendingQueueDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/antrean/list`); // Panggil API
        const data = response.data;
    
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const endOfDay = new Date().setHours(23, 59, 59, 999);
    
        // Filter antrean dengan status `pending` hari ini
        const filteredAndSortedData = data
          .filter(queue =>
            queue.status === 'pending' &&
            queue.no_show_stamp &&
            new Date(queue.no_show_stamp).getTime() >= startOfDay &&
            new Date(queue.no_show_stamp).getTime() <= endOfDay &&
            queue.complete_stamp === null
          )
          .sort((a, b) => new Date(a.called_stamp) - new Date(b.called_stamp));
    
        setPendingQueues(filteredAndSortedData); // Update state
      } catch (error) {
        console.error('Error fetching pending queues:', error);
      }
    };    
    

    const handlePendingItemClick = async (queueToCall) => {
      try {
        // Perbarui status antrean menjadi "called"
        await axios.patch(`${BASE_URL}/antrean/status`, {
          nomorAntrean: queueToCall,
          status: 'called',
        });
    
        // Perbarui loket untuk antrean yang dipanggil
        await axios.patch(`${BASE_URL}/antrean/loket`, {
          nomorAntrean: queueToCall,
          loket: `Loket ${selectedLoket}`, // Sesuaikan dengan backend
        });
        
         // Emit ke server bahwa antrean pending dipanggil
    socket.emit("queueCalledFromPending", {
      nomorAntrean: queueToCall,
      loket: selectedLoket,
    });

        setCalledQueue(queueToCall); // Set antrean yang dipanggil
        setLastCalledQueue(queueToCall); // Tandai sebagai antrean terakhir yang dipanggil
    
        // Hapus antrean dari daftar pending
        setPendingQueues(pendingQueues.filter(queue => queue.nomorAntrean !== queueToCall));
    
        // Aktifkan tombol "Mulai Layanan" dan nonaktifkan "Selesaikan Layanan"
        setIsStartServiceEnabled(true);
        setIsCompleteServiceEnabled(false);
    
        Swal.fire({
          title: 'Memanggil Nomor Antrian dari Pending',
          text: `${queueToCall}`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Error calling pending queue:', error);
        Swal.fire('Gagal Memanggil Pendingan', 'Terjadi kesalahan.', 'error');
      }
    };
    
    useEffect(() => {
      fetchPendingQueueDetails(); // Ambil data antrean pending saat halaman dimuat

      const intervalId = setInterval(fetchPendingQueueDetails, 30000); // Perbarui data setiap 10 detik

      return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
    }, []);

    const handleCalledItemClick = async (queueToCall) => {
      try {
          // Validasi apakah loket sudah dipilih
          if (!selectedLoket) {
              Swal.fire('Loket Belum Dipilih', 'Silakan pilih Loket terlebih dahulu.', 'warning');
              return;
          }

          // Ubah status antrean menjadi "recalled"
          await fetch(`${BASE_URL}/antrean/${queueToCall}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ newStatus: 'recalled', loketName: `Loket ${selectedLoket}` }),
          });

          // Perbarui loket untuk antrean yang dipanggil
          await fetch(`${BASE_URL}/antrean/${queueToCall}/loket`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ loketName: `Loket ${selectedLoket}` }),
          });

          setCalledQueue(queueToCall); // Set antrean yang dipanggil
          setLastCalledQueue(queueToCall); // Tandai sebagai antrean terakhir yang dipanggil

          // Aktifkan tombol "Mulai Layanan"
          setIsStartServiceEnabled(true);
          setIsCompleteServiceEnabled(false);
          setIsOtherButtonsDisabled(false); // Pastikan tombol lainnya bisa diakses

          Swal.fire({
              title: 'Memanggil Ulang Nomor Antrian',
              text: `${queueToCall}`,
              icon: 'info',
              timer: 2000, // Swal otomatis hilang setelah 2 detik
              showConfirmButton: false, // Sembunyikan tombol "OK"
              timerProgressBar: true, // Tampilkan progress bar
          });
      } catch (error) {
          console.error('Error calling/recalled queue:', error);
          Swal.fire('Gagal Memanggil Ulang', 'Terjadi kesalahan.', 'error');
      }
    };

    const handleRecallQueue = async () => {
      if (!lastCalledQueue) {
        Swal.fire('Tidak Ada Nomor untuk Dipanggil Ulang', 'Belum ada nomor yang dipanggil.', 'error');
        return;
      }
    
      const currentRecallAttempts = callAttemptsPerQueue[lastCalledQueue] || 0;
    
      try {
        console.log("Recall Queue Payload: ", {
          nomorAntrean: lastCalledQueue,
          status: currentRecallAttempts >= 2 ? "pending" : "recalled",
          loketName: `Loket ${selectedLoket}`
        });
        
        // Emit ke server untuk mengupdate antrean yang dipanggil ulang
    socket.emit("queueRecalled", {
      nomorAntrean: lastCalledQueue,
      loket: selectedLoket,
    });

        // After 3 recalls, move the queue to 'pending'
        if (currentRecallAttempts >= 2) {
          const response = await axios.patch(
            "/antrean/status",
            {
              nomorAntrean: lastCalledQueue,
              status: "pending",
              loketName: `Loket ${selectedLoket}`,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-token": localStorage.getItem("token"),
              },
            }
          );
    
          console.log("Server Response:", response.data);
    
          Swal.fire({
            title: "Nomor Antrian Dipindahkan ke Pending",
            text: `${lastCalledQueue} telah dipanggil 3 kali.`,
            icon: "warning",
            confirmButtonText: "OK",
          });
    
          // Update state
          setPendingQueues((prevPendingQueues) => [...prevPendingQueues, lastCalledQueue]);
          setCallAttemptsPerQueue((prev) => {
            const newAttempts = { ...prev };
            delete newAttempts[lastCalledQueue];
            return newAttempts;
          });
    
          setIsCallEnabled(true);
          setCalledQueue(null);
          return;
        }
    
        // Recalling queue (recall < 3 times)
        const recallResponse = await axios.patch(
          `${BASE_URL}/antrean/status`,
          {
            nomorAntrean: lastCalledQueue,
            status: "recalled",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem("token"),
            },
          }
        );
    
        console.log("Recall Response:", recallResponse.data);
    
        // Update Loket
        const loketResponse = await axios.patch(
          `${BASE_URL}/antrean/loket`,
          {
            nomorAntrean: lastCalledQueue,
            loket: `Loket ${selectedLoket}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem("token"),
            },
          }
        );
    
        console.log("Loket Update Response:", loketResponse.data);
    
        setCalledQueue(lastCalledQueue);
    
        // Increment recall count for the queue
        setCallAttemptsPerQueue((prevAttempts) => ({
          ...prevAttempts,
          [lastCalledQueue]: currentRecallAttempts + 1,
        }));
    
        Swal.fire({
          title: "Memanggil ulang nomor antrian",
          text: `${lastCalledQueue}`,
          icon: "info",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error recalling queue:", error.response?.data || error.message);
        Swal.fire(
          "Gagal Memanggil Ulang Antrian",
          error.response?.data?.message || "Terjadi kesalahan saat memanggil ulang antrian.",
          "error"
        );
      }
    };
    
    
  
    const handleCompleteKIA = async () => {
      if (!selectedQueue || !selectedLoket) {
        Swal.fire(
          "Pilih Nomor dan Loket",
          "Silakan pilih nomor antrean dan loket terlebih dahulu.",
          "warning"
        );
        return;
      }
    
      try {
        // Update queue status to "completed"
        const response = await axios.patch(
          `${BASE_URL}/antrean/status`,
          {
            nomorAntrean: selectedQueue, // Pass the queue number
            status: "completed", // Updated status
            loket: `Loket ${selectedLoket}`, // Provide loket information
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem("token"), // Include authentication token if required
            },
          }
        );
    
        if (response.status === 200) {
          Swal.fire({
            title: "Layanan Selesai",
            text: `Nomor ${selectedQueue} telah diselesaikan sebagai Pasien KIA.`,
            icon: "success",
            timer: 2000, // Swal will automatically close after 2 seconds
            showConfirmButton: false, // Hide the "OK" button
            timerProgressBar: true, // Show a progress bar
          });
    
          // Update state
          setCalledQueue(null); // Reset the called queue
          setSelectedQueue(null); // Reset the selected queue
          setIsCompleteEnabled(false);
          setIsStartEnabled(false);
        } else {
          Swal.fire(
            "Gagal Menyelesaikan Antrian",
            response.data.message || "Terjadi kesalahan saat menyelesaikan antrian.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error completing service for KIA:", error);
        Swal.fire("Error", "Terjadi kesalahan saat menyelesaikan layanan.", "error");
      }
    };
    
    
    const handleStartService = async () => {
      if (!calledQueue) {
        Swal.fire("Error", "Nomor antrean belum dipilih.", "error");
        return;
      }
    
      try {
        // Panggil API untuk mengubah status menjadi 'processed'
        const response = await axios.patch(
          `${BASE_URL}/antrean/status`,
          {
            nomorAntrean: calledQueue, // Nomor antrean yang dipilih
            status: "processed",      // Status baru
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem("token"),
            },
          }
        );
    
        if (response.status === 200) {
          Swal.fire({
            title: "Layanan Dimulai",
            text: `Layanan untuk nomor ${calledQueue} telah dimulai.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
          
          // Emit ke server bahwa layanan dimulai
    socket.emit("serviceStarted", {
      nomorAntrean: calledQueue,
      loket: selectedLoket,
    });

          // Update state
          setIsStartEnabled(false);
          setIsCompleteEnabled(true);
          setIsAllButtonsDisabled(true);
        } else {
          throw new Error(response.data.message || "Gagal memulai layanan.");
        }
      } catch (error) {
        console.error("Error starting service:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Gagal memulai layanan.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    };
    
  
    const handleCompleteService = async () => {
      if (!calledQueue || !selectedLoket) {
        Swal.fire(
          "Pilih Nomor dan Loket",
          "Silakan pilih nomor antrean dan loket terlebih dahulu.",
          "warning"
        );
        return;
      }
    
      try {
        // Send a PATCH request to /antrean/status
        const response = await axios.patch(
          `${BASE_URL}/antrean/status`,
          {
            nomorAntrean: calledQueue,
            status: "completed",
            loket: selectedLoket, // Include if your backend uses this
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem("token"),
            },
          }
        );
    
        if (response.status === 200) {
          Swal.fire({
            title: "Layanan Selesai",
            text: `Layanan untuk nomor ${calledQueue} telah selesai.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
          
           // Emit ke server bahwa layanan selesai
    socket.emit("serviceCompleted", {
      nomorAntrean: calledQueue,
      loket: selectedLoket,
    });
    
          // Reset state after completing service
          setCalledQueue(null); // Reset antrean yang dipanggil
          setSelectedQueue(null); // Reset antrean yang dipilih
          setIsStartEnabled(false); // Nonaktifkan tombol "Mulai Layanan"
          setIsCompleteEnabled(false); // Nonaktifkan tombol "Selesaikan Layanan"
          setIsAllButtonsDisabled(false); // Aktifkan tombol lainnya
          setIsCallEnabled(true); // Aktifkan tombol "Panggil Nomor"
        } else {
          Swal.fire(
            "Gagal Menyelesaikan Layanan",
            response.data.message || "Terjadi kesalahan.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error completing service:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Gagal menyelesaikan layanan.",
          "error"
        );
      }
    };    
        

return (
          <Grid
      container
      spacing={4}
      justifyContent="center"
      alignItems="flex-start"
      style={{
        minHeight: "80vh",
        textAlign: "center",
        paddingTop: "1rem", // Kurangi padding atas
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >

        <Header />
        <MovingText greeting={greeting} username={username} />
        <MenuDropdown role="admin" username="username"/>
        <Grid item xs={12} md={3}>
          <DaftarAntrian
             isFetching={isFetching}
             pendingQueues={pendingQueues}
             calledQueues={calledQueues}
             isViewingPending={isViewingPending}
             handleCancelAllPendingQueues={handleCancelAllPendingQueues}
             setIsViewingPending={setIsViewingPending}
             handlePendingItemClick={handlePendingItemClick} // Add this line
             handleCalledItemClick={handleCalledItemClick} // Ensure this is also passed if required
             setSelectedQueue={setSelectedQueue} // Berikan state setter ke komponen anak
             selectedQueue={selectedQueue}      // Berikan nomor yang dipilih ke komponen anak
             isLoketSelected={isLoketSelected}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PilihLoket
            selectedLoket={selectedLoket}
            handleLoketChange={handleLoketChange}
            selectedService={selectedService}
            handleServiceChange={handleServiceChange}
            waitingCounts={waitingCounts}
            availableQueues={availableQueues}
            setSelectedQueue={setSelectedQueue} // Pass the setter function for selectedQueue
            selectedQueue={selectedQueue}
            isLoketSelected={isLoketSelected}
          />
        </Grid>
        <Grid item xs={12} md={3}>
        <NomorAntrian
          calledQueue={calledQueue} // Pastikan ini adalah antrean yang dipanggil
          selectedLoket={selectedLoket} // Loket saat ini
        />

          <TombolAksi
              handleCallQueue={handleCallQueue}
              handlePendingQueue={handlePendingQueue}
              handleStartService={handleStartService}
              handleCompleteService={handleCompleteService}
              handleRecallQueue={handleRecallQueue}
              handleCompleteKIA={handleCompleteKIA}
              isLoketSelected={isLoketSelected}
              isCallEnabled={isCallEnabled}
              isStartEnabled={isStartEnabled}
              isCompleteEnabled={isCompleteEnabled}
              isAllButtonsDisabled={isAllButtonsDisabled}
          />
        </Grid>
        <ResetButton/>
        <Footer />
      </Grid>
    );
  }