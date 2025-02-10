// src/context/SpeechContext.js
import { createContext, useContext, useState } from 'react';

const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true); // or default to false if you want speech to start disabled
  
  return (
    <SpeechContext.Provider value={{ isSpeechEnabled, setIsSpeechEnabled }}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeechContext = () => useContext(SpeechContext);