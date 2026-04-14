import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    // We start muted by default just to be safe
    const [isGlobalMuted, setIsGlobalMuted] = useState(true);

    return (
        <AudioContext.Provider value={{ isGlobalMuted, setIsGlobalMuted }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);