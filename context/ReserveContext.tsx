"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Reserve = {
  title: string;
  price: number;
  quantity: number;
  amount: number;
};

type ReserveContextType = {
  reserve: Reserve | null;
  setReserve: (reserve: Reserve) => void;
};

const ReserveContext = createContext<ReserveContextType | undefined>(undefined);

export function ReserveProvider({ children }: { children: ReactNode }) {
  const [reserve, setReserve] = useState<Reserve | null>(null);

  return (
    <ReserveContext.Provider value={{ reserve, setReserve }}>
      {children}
    </ReserveContext.Provider>
  );
}

export function useReserve() {
  const context = useContext(ReserveContext);
  if (!context) {
    throw new Error("useReserve doit être utilisé dans un ReserveProvider");
  }
  return context;
}