import Image from "next/image";

interface Product {
  name: string;
  tagline: string;
  description: string;
  image: string;
  url: string;
}

interface ProductGridProps {
  products?: Product[];
}

const defaultProducts: Product[] = [
  {
    name: "Dex",
    tagline: "The Language Learning Camera",
    description: "Dex helps children learn new languages through hands-on discovery, turning their curiosity and real-world moments into interactive, fun lessons.",
    image: "/dex-horizontal.jpg",
    url: "https://dex.camera",
  },
  {
    name: "Supper",
    tagline: "AI Data Agent for High-Growth Companies",
    description: "Supper is built for fast-moving startup teams that need clear, trustworthy answers without wrestling messy data or waiting on a data analyst ticket.",
    image: "/supper-cover.jpg",
    url: "https://supper.co",
  },
  {
    name: "Sensible",
    tagline: "High-Yield Account for Crypto",
    description: "Sensible puts your crypto to work so you can earn interest on it, while staying fully in control of your funds. Sensible was acquired by Coinbase in Sep 2025.",
    image: "/sensible-cover.webp",
    url: "https://www.holdsensible.com/",
  },
  {
    name: "Waffle",
    tagline: "The Visual Organization App",
    description: "Waffle is the homepage for all your to-do’s, events, lists, and everything you need to keep your life beautifully organized. Stay on top of the things that matter most.",
    image: "/waffle-cover.jpg",
    url: "https://heywaffle.app/",
  },
  {
    name: "Ritual Dental",
    tagline: "Personalized Preventive Oral Care",
    description: "Ritual Dental offers personalized preventive oral care supported by tools that track, measure, and improve your habits between visits.",
    image: "/ritual-horizontal.jpg",
    url: "https://www.ritualdental.com/",
  },
];

export default function ProductGrid({ products = defaultProducts }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-y-9">
      {products.map((product) => (
        <div 
          key={product.name} 
          className="p-5 rounded-[20px] bg-white border border-neutral-200 flex flex-col gap-5"
        >
          <a 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-1">
              <h3 className="text-lg md:text-base font-medium text-neutral-800 tracking-[-0.02em]">{product.name}</h3>
              <span className="hidden md:inline text-base font-medium text-neutral-500 tracking-[-0.02em]">— {product.tagline}</span>
            </div>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-neutral-500 group-hover:text-neutral-800 transition-colors shrink-0"
            >
              <path 
                d="M5 12.6818L18 12.6818M18 12.6818L12.6818 18M18 12.6818L12.6818 7.36364" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="aspect-video w-full overflow-hidden rounded-xl"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
          </a>
          <p className="text-base text-neutral-500 tracking-[-0.02em]">{product.description}</p>
        </div>
      ))}
    </div>
  );
}

