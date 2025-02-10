// context/NonpkContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const NonpkContext = createContext();

export function NonpkProvider({ children }) {
    const [nonpk, setNonpk] = useState('');

    return (
        <NonpkContext.Provider value={{ nonpk, setNonpk }}>
            {children}
        </NonpkContext.Provider>
    );
}

export const useNonpk = () => useContext(NonpkContext);