// src/app/layout.js
import './globals.css';
import { NonpkProvider } from '../context/NonpkContext';

export default function RootLayout({ children }) {
  return (
      <html lang="en">
          <body>
              <NonpkProvider>
                  {children}
              </NonpkProvider>
          </body>
      </html>
  );
}