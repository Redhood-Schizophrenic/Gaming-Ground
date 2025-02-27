'use client';
import { fetchDevices } from "@/lib/crud/Devices";

export default function Home() {
  console.log(fetchDevices());
  return (
    <h1 className="p-6">  </h1>
  );
}
