"use client";
import { ReactNode, useState } from "react";
import { PasswordContext } from "./passwordContext";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  children: ReactNode;
};

export function PasswordProvider({ children }: Props) {
  const [passwords, setPasswords] = useState<[]>([]);
  const {toast} = useToast();

  async function storePasswords() {
    try {
      const response = await axios.get("/api/get-application-password");
      if (passwords.length < response.data.data.length) {
        setPasswords(response.data.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  }
  const value = {
    passwords,
    storePasswords,
  };

  return (
    <>
      <PasswordContext.Provider value={value}>
        {children}
      </PasswordContext.Provider>
    </>
  );
}
