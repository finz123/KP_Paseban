export const createTables = {
  queueLogs: `
    CREATE TABLE IF NOT EXISTS queueLogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nonpk VARCHAR(255) NOT NULL,
      nomorAntrean VARCHAR(50) NOT NULL,
      loket VARCHAR(100),
      serviceType VARCHAR(100) NOT NULL,
      pasienType VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      waiting_stamp DATETIME NOT NULL,
      called_stamp DATETIME,
      processed_stamp DATETIME,
      complete_stamp DATETIME,
      no_show_stamp DATETIME,
      cancel_stamp DATETIME,
      user_id INT
    )
  `,
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  queueTypes: `
    CREATE TABLE IF NOT EXISTS queueTypes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userType VARCHAR(50) NOT NULL,
      serviceType VARCHAR(50) NOT NULL,
      queueCode VARCHAR(10) NOT NULL
    )
  `,
  antrianCounter: `
    CREATE TABLE IF NOT EXISTS antrian_counter (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pasienType VARCHAR(50) NOT NULL,
      serviceType VARCHAR(50) NOT NULL,
      counter INT DEFAULT 0 NOT NULL
    )
  `,
  loket: `
    CREATE TABLE IF NOT EXISTS loket (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(255),
      user_id INT,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  refreshTokens: `
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  blacklistTokens: `
    CREATE TABLE IF NOT EXISTS blacklist_tokens (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) NOT NULL,
      blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reason TEXT
    )
  `,
  resetLogs: `
    CREATE TABLE IF NOT EXISTS reset_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reset_time DATETIME NOT NULL,
      status VARCHAR(50) DEFAULT 'SUCCESS',
      message TEXT
    )
  `
};
  
export const initialData = {
  users: [
    {
      username: 'admin',
      password: '$2b$12$vFLivozASgSIcsgP5MQNw.gBmZ47j.qM60uXPCR5/8Dl6EeznaZNu', // "admin"
      email: 'admin@gmail.com',
      role: 'admin',
    },
  ],
  queueTypes: [
    { userType: 'Karyawan', serviceType: 'BPJS', queueCode: 'KB' },
    { userType: 'Umum', serviceType: 'BPJS', queueCode: 'UB' },
    { userType: 'Karyawan', serviceType: 'PJPK', queueCode: 'KP' },
    { userType: 'Umum', serviceType: 'ASURANSI', queueCode: 'UA' },
    { userType: 'Umum', serviceType: 'UMUM', queueCode: 'UU' },
  ],
  antrianCounter: [
    { pasienType: 'Umum', serviceType: 'ASURANSI', counter: 0 },
    { pasienType: 'Umum', serviceType: 'UMUM', counter: 0 },
    { pasienType: 'Umum', serviceType: 'BPJS', counter: 0 },
    { pasienType: 'Karyawan', serviceType: 'BPJS', counter: 0 },
    { pasienType: 'Karyawan', serviceType: 'PJPK', counter: 0 },
  ],
  loket: [
    { name: 'Loket 1', description: 'Pelayanan Umum', user_id: null, status: 'active' },
    { name: 'Loket 2', description: 'BPJS Karyawan', user_id: null, status: 'active' },
    { name: 'Loket 3', description: 'BPJS Umum', user_id: null, status: 'active' },
    { name: 'Loket 4', description: 'Asuransi', user_id: null, status: 'active' },
  ],
};