import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import BookDetails from "@/app/books/BookDetails";

export default async function BookDetailsPage({
  params,
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-base-200/40">
      

      <main>
        <BookDetails id={id} />
      </main>


    </div>
  );
}