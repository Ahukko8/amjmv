"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import Loading from "@/components/Loading";
import Image from "next/image";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";

interface OtherPDFData {
  __id: string;
  title: string;
  pdfFile: string; 
  description?: string;
  image?: string;
}

interface PDFPageProps {
  params: Promise<{ id: string }>;
}

export default function OtherPDFReader({ params }: PDFPageProps) {
  const { id } = React.use(params);
  const [pdf, setPdf] = useState<OtherPDFData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/otherPdfs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        const data = await response.json();
        setPdf(data.otherPdf); 
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Failed to load PDF. Please try again.");
        setTimeout(() => router.push("/otherChannel/pdf"), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPDF();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100">
          <div className="text-center backdrop-blur-lg bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-lg">
            <Loading />
            <p className="mt-4 text-gray-600 font-medium font-faseyha">ޕީ.ޑީ.އެފް ލޯޑުކުރަނީ...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 p-4">
          <div className="text-center backdrop-blur-lg bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 font-faseyha">މައްސަލައެއް </h2>
            <p className="text-gray-600 font-faseyha">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pdf) return null;

  return (
    <div>
      <Header />
      <div className="mt-10 flex flex-col min-h-screen font-faseyha bg-gradient-to-b from-gray-50 via-white to-gray-100">
        <main className="flex-1 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8 sm:mb-12">
              <Link 
                href="/otherChannel/pdf" 
                className="inline-flex items-center gap-3 backdrop-blur-md bg-white/20 hover:bg-white/30 border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-full text-gray-900 font-medium transition-all duration-300 hover:scale-105 shadow-lg group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>ފަހަތަށް</span>
              </Link>
            </div>

            {/* Main Content Card */}
            <div className="backdrop-blur-lg bg-white/90 border border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Section with Decorative Line */}
              <div className="px-6 sm:px-8 lg:px-12 pt-8 sm:pt-12">
                <div className="flex items-center justify-center mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1" />
                  <a
                    href={pdf.pdfFile}
                    download={`${pdf.title}.pdf`}
                    className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-md bg-white/20 hover:bg-white/30 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg group min-w-[160px] justify-center"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
                    <span>ޑައުންލޯޑް</span>
                  </a>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1" />
                </div>
              </div>

              <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
                {/* PDF Image/Preview */}
                <div className="flex justify-center mb-8 sm:mb-10">
                  {pdf.image ? (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-300/50 rounded-2xl blur-xl transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <Image
                        src={pdf.image}
                        alt={pdf.title}
                        width={320}
                        height={200}
                        className="relative object-cover w-full max-w-sm h-40 sm:h-48 rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105 border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-sm h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl flex items-center justify-center border border-gray-200 group hover:shadow-2xl transition-all duration-500">
                      <FileText className="w-16 h-16 text-gray-600 group-hover:text-gray-700 transition-colors duration-300" />
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div className="text-center mb-8 sm:mb-10">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                    {pdf.title}
                  </h1>
                  {pdf.description && (
                    <div className="backdrop-blur-sm bg-gray-50/50 border border-gray-200 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {pdf.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}