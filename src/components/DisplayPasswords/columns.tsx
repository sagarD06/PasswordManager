"use client"

import { ColumnDef } from "@tanstack/react-table"
import {passwordStorageSchema} from "@/schemas/passwordStorageSchema"
import { Password } from "@/models/User.model"


export const columns: ColumnDef<Password>[] = [
  {
    accessorKey: "applicationName",
    header: "Application Name",
  },
  {
    accessorKey: "password",
    header: "Application Password",
  },
]
