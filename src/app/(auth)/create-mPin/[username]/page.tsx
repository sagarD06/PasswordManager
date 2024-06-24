"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { mPinSchema } from "@/schemas/mPinSchema";
import React, { useState } from "react";
import z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";

const createMpin = () => {
  const [isCreatingMpin, setIsCreatingMpin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();

  const form = useForm<z.infer<typeof mPinSchema>>({
    resolver: zodResolver(mPinSchema),
  });

  const onSubmit = async (data: z.infer<typeof mPinSchema>) => {
    setIsCreatingMpin(true);
    try {
      const response = await axios.post(
        `/api/create-mpin?username=${params.username}`,
        { username: params.username, mpin: data.mPin }
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Your M-Pin has been created.",
        });
        router.replace("/sign-in");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to verify code.",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsCreatingMpin(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md z-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Create new pin
          </h1>
          <p className="mb-4">Please create the pin</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="mPin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Pin</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your pin" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="mPin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Pin</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your pin" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-3 bg-orange-400 hover:bg-orange-600"
              disabled={isCreatingMpin}
            >
              {isCreatingMpin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating..
                </>
              ) : (
                "Create pin"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default createMpin;
