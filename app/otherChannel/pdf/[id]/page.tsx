"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import Loading from "@/components/Loading";

// Define the PDF data structure
interface OtherPDFData {
  _id: string;
  title: string;
  pdfFile: string; // URL to the PDF
}

interface PDFPageProps {
  params: Promise<{ id: string }>;
}

export default function OtherPDFReader({ params }: PDFPageProps) {
  const { id } = React.use(params); // Unwrap params with React.use()
  const [pdf, setPdf] = useState<OtherPDFData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await fetch(`/api/otherPdfs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        const data = await response.json();
        setPdf(data.pdf); // Assuming your API returns { pdf: {...} }
      } catch (error) {
        console.error("Error fetching PDF:", error);
        router.push("/otherChannel/pdf"); // Redirect on error
      }
    };
    fetchPDF();
  }, [id, router]);

  if (!pdf) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-12 font-faseyha text-lg">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-faseyha">
      <Header />
      <main className="flex-grow bg-gray-100 py-6 sm:py-8 font-faseyha">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            {pdf.title}
          </h1>
          <PDFViewer pdfUrl={pdf.pdfFile} filename={`${pdf.title}.pdf`} />
        </div>
      </main>
      <Footer />
    </div>
  );
}