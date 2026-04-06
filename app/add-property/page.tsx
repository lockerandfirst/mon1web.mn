"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddPropertyForm } from "@/components/add-property-form"

export default function AddPropertyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Үл хөдлөх хөрөнгө нэмэх</h1>
            <p className="text-muted-foreground">Байрны мэдээллээ оруулж, худалдах эсвэл түрээслэх зар тавина уу</p>
          </div>
          <AddPropertyForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
