"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Password } from "@/models/User.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStorageSchema } from "@/schemas/passwordStorageSchema";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { columns } from "@/components/DisplayPasswords/columns";
import DisplayTable from "@/components/DisplayPasswords/DisplayTable";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const form = useForm<z.infer<typeof passwordStorageSchema>>({
    resolver: zodResolver(passwordStorageSchema),
  });
  const { data: session } = useSession();

  async function getPasswords() {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/get-application-password");
      if (passwords.length < response.data.data.length) {
        setPasswords(response.data.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data);
    }finally{
      setIsLoading(false);
    }
  }
  // console.log(passwords);
  useEffect(() => {
    if (!session) return;
    getPasswords();
  }, [passwords, getPasswords]);

  async function onSubmit(data: z.infer<typeof passwordStorageSchema>) {
    try {
      if (!isEditable) {
        setIsAddingPassword(true);
        const response = await axios.post("/api/create-application-password", {
          applicationName: data.applicationName,
          applicationPassword: data.applicationPassword,
        });
        if (!response.data.success) {
          toast({
            title: "Error",
            description: response.data.message,
            variant: "destructive",
          });
        }
      } else {
        setIsEditable(true);
        await axios.patch(`/api/edit-application-password/${params._id}`, {
          applicationName: data.applicationName,
          applicationPassword: data.applicationPassword,
        });
        toast({
          title: "Password edited successfully",
          description: "Your password has been edited.",
          variant: "default",
        });
      }
      toast({
        title: "Password added successfully",
        description: "Your password has been added.",
        variant: "default",
      });
      form.reset({
        ...form.getValues(),
        applicationName: "",
        applicationPassword: "",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingPassword(false);
    }
  }
  async function handleEditPassword(password: Password) {}
  async function handleDeletePassword(password: Password) {}
  async function handleToggleVisibility() {}
  // console.log(passwords)
  return (
    <div className="flex flex-col relative justify-center items-center min-h-screen dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2]">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <Navbar />
      <h1 className="font-bold text-xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-6">
        Hello {session?.user.username}
      </h1>
      <section className="w-full md:w-[70%] bg-white dark:bg-gray-800 px-4 md:px-6 py-5 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="applicationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Any Application" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Password</FormLabel>
                  <FormControl>
                    <Input placeholder="**********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-orange-400 hover:bg-orange-600"
              disabled={isAddingPassword}
            >
              {isAddingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> "Adding..."
                </>
              ) : (
                "Add"
              )}
            </Button>
          </form>
        </Form>
      </section>
      <section className="w-full md:w-[70%] bg-white dark:bg-gray-800  px-4 md:px-6 py-5 rounded-lg mt-10 shadow-lg">
        <DisplayTable columns={columns} data={passwords}/>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
