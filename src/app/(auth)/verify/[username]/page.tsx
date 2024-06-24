"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import z from "zod";
import { verifyTokenSchema } from "@/schemas/verifySchema";
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

const verifyCodePage = () => {
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();

  const form = useForm<z.infer<typeof verifyTokenSchema>>({
    resolver: zodResolver(verifyTokenSchema),
  });

  const onSubmit = async (data: z.infer<typeof verifyTokenSchema>) => {
    setIsVerifyingCode(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      if (response.data.success) {
        toast({
          title: "Code Verified successfully",
          description: response.data.message,
        });
        router.replace(`/create-mPin/${params.username}`);
      } else {
        toast({
          title: "Failed to verify code.",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to verify code.",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifyingCode(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      {/* <BackgroundBeams /> */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md z-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your OTP" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-600" disabled={isVerifyingCode}>
              {isVerifyingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying..
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default verifyCodePage;
