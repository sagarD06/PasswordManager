import { createContext } from "react";

type passwordContextType = {
  passwords: [];
  storePasswords: () => void;
};

const PasswordDefaultValues: passwordContextType = {
  passwords: [],
  storePasswords: () => {},
};

export const PasswordContext = createContext(PasswordDefaultValues);
