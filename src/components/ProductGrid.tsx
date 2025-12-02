import Image from "next/image";

interface Product {
  name: string;
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
    description: "The language learning camera",
    image: "/dex-cover.jpg",
    url: "https://dex.camera",
  },
  {
    name: "Supper",
    description: "The AI data agent",
    image: "/supper-cover.jpg",
    url: "https://supper.co",
  },
  {
    name: "Sensible",
    description: "The high-yield account for crypto",
    image: "/sensible-cover.webp",
    url: "https://www.holdsensible.com/",
  },
  {
    name: "Waffle",
    description: "The visual organization app",
    image: "/waffle-cover.png",
    url: "https://heywaffle.app/",
  },
  {
    name: "Workmate",
    description: "The AI scheduling assistant",
    image: "/workmate-cover.jpg",
    url: "https://www.workmate.com/",
  },
  {
    name: "Ritual Dental",
    description: "Personalized preventive oral care",
    image: "/ritualdental-cover Large.jpeg",
    url: "https://www.ritualdental.com/",
  },
];

export default function ProductGrid({ products = defaultProducts }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9">
      {products.map((product) => (
        <div key={product.name} className="flex flex-col gap-3">
          <a 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="aspect-square w-full overflow-hidden rounded-lg"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </a>
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-neutral-800">{product.name}</h3>
            <p className="text-neutral-500">{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

