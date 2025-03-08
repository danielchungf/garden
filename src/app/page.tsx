import Image from "next/image";
import ProjectShowcase from "@/components/project-showcase"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen">
      
      <main className="flex flex-col gap-8 row-start-2 items-start">
       
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-[-0.02em]">Daniel Chung</h1>
          <p className="text-xl font-medium tracking-[-0.02em] text-gray-600">I'm a product designer working with early-stage startups to quality products, fast.</p>

        </div>
     
        <ProjectShowcase />

      </main>

    
      
    </div>
  );
}
