"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AddPropertyForm } from "@/components/add-property/add-property-form";

export default function AddPropertyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <AddPropertyForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
