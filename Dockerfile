# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Salin dependencies dan instal
COPY package*.json ./
RUN npm install

# Salin semua file
COPY . .

# Build aplikasi
RUN npm run build

# Jalankan aplikasi dengan opsi IP fleksibel
CMD ["npx", "next", "start", "-p", "3200", "-H", "0.0.0.0"]
