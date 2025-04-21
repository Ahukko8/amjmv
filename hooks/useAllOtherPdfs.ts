import { useEffect, useState } from 'react';

interface Pdf {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  image: string | null;
  categoryId: string | null;
}

interface UseAllOtherPdfsProps {
  page: number;
  limit: number;
  categoryId: string | null;
}

interface UseAllOtherPdfsReturn {
  pdfs: Pdf[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export const useAllOtherPdfs = ({ page, limit, categoryId }: UseAllOtherPdfsProps): UseAllOtherPdfsReturn => {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL('/api/otherPdfs', window.location.origin);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('limit', limit.toString());
        if (categoryId) url.searchParams.set('category', categoryId);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch PDFs");
        const data = await response.json();
        
        setPdfs(data.pdfs);
        setTotal(data.total);
      } catch (err) {
        console.error('Error fetching PDFs:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch PDFs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfs();
  }, [page, limit, categoryId]);

  return { pdfs, total, isLoading, error };
};
