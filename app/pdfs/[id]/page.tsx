"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import Loading from "@/components/Loading";
import Image from "next/image";
import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";


interface PDFData {
  _id: string;
  title: string;
  pdfFile: string; 
  description?: string;
  image?: string;
}

interface PDFPageProps {
  params: Promise<{ id: string }>;
}

export default function PDFReader({ params }: PDFPageProps) {
  const { id } = React.use(params);
  const [pdf, setPdf] = useState<PDFData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await fetch(`/api/pdfs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        const data = await response.json();
        setPdf(data.pdf); 
      } catch (error) {
        console.error("Error fetching PDF:", error);
        router.push("/pdfs"); 
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
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center text-black">
            {pdf.title}
          </h1>
          <p className="text-lg sm:text-2xl mb-4 text-center text-black">
            {pdf.description}
          </p>
          {pdf.image ? (
            <div className="flex justify-center items-center mb-6">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <Image
                  src={pdf.image}
                  alt={pdf.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-auto rounded-lg"
                />
              </div>
            </div>
            ) : (
              <div className="relative h-48 w-full bg-[#F5F5F5] flex items-center justify-center mb-6 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
                )}
          <div className="flex justify-center items-center gap-4 mt-8">
            <a
              href={pdf.pdfFile}
              download={`${pdf.title}.pdf`}
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium text-lg rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              ޑައުންލޯޑް
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
              <Link href="/pdfs" className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium text-lg rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
>
                ފަހަތަށް
                <ArrowLeftCircleIcon className="mr-2" />
              </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}