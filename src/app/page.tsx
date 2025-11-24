import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-[664px] px-6 py-12 leading-relaxed sm:py-24">
      
      <div className="flex flex-col gap-6">
          <div className="rounded-lg overflow-hidden mb-2 w-[100px] h-[100px]">
            <Image 
              src="/image-portfolio.jpg" 
              alt="Daniel Chung" 
              width={100}
              height={100}
              className="w-[100px] h-[100px] object-cover rounded-lg"
            />
          </div>
          <h1 className="text-[22px] font-medium text-neutral-800 ">Hey, I&apos;m Daniel</h1>
          <p className="text-neutral-500">I&apos;m a product designer based in Washington, DC, working with early-stage startups. Recently, I&apos;ve teamed up with the founders of <a href="https://dex.camera" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">Dex</a>, <a href="https://supper.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">Supper</a>, <a href="https://www.holdsensible.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">Sensible</a> (acquired by <a href="https://coinbase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">Coinbase</a>), <a href="https://www.workmate.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">Workmate</a>, and <a href="https://www.ritualdental.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">Ritual Dental</a> to build zero to one products.</p>
          <p className="text-neutral-500">I grew up in the coastal city of Lima, where I studied communications and spent time building brands and creating tech content. After reviewing hundreds of products, I realized I wanted to build them. So I taught myself design and programming, and I&apos;ve spent the last two years doing exactly that.</p>
          <p className="text-neutral-500">When I&apos;m not designing, I enjoy cooking, overplanning trips, taking photos that sit unedited for a while, and fine-tuning every corner of my apartment.</p>

      </div>
      
    </main>
  );
}
