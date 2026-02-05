import ProductGrid from "@/components/ProductGrid";
import ProjectsList from "@/components/ProjectsList";

export default function Home() {
  return (
    <main>
      {/* Header Nav */}
      <header className="flex gap-5 p-4 border-b border-muted sticky top-0 bg-white z-10">
        <h1 className="text-h2 text-content-primary flex-1">Daniel Chung</h1>
        <span className="text-h2 text-content-primary flex-1">Product Designer</span>
      </header>

      {/* Bio + Lists */}
      <section className="flex flex-col md:flex-row gap-5 px-4 pt-6 pb-10">
        <div className="flex-1">
          <div className="flex flex-col gap-6 md:pr-[100px]">
            <p className="text-body-regular text-content-primary">
              I&apos;m a designer who brings new technology to life. I work with
              early-stage startups to take ideas from zero to one, and I build
              my own products on the side.
            </p>
            <p className="text-body-regular text-content-primary">
              I grew up in the coastal city of Lima, where I studied
              communications and spent time building brands and creating tech
              content. After reviewing hundreds of products, I realized I wanted
              to build them. So I taught myself design and programming, and
              I&apos;ve spent the last two years doing exactly that.
            </p>
            <p className="text-body-regular text-content-primary">
              When I&apos;m not designing, I enjoy cooking, overplanning trips,
              taking photos that sit unedited for a while, and fine-tuning every
              corner of my apartment.
            </p>
          </div>
        </div>

        <div className="flex gap-5 flex-1">
          <div className="flex flex-col flex-1">
            <h2 className="text-h3 text-content-secondary uppercase mb-3">
              Work
            </h2>
            <span className="text-body-small text-content-primary">Dex</span>
            <span className="text-body-small text-content-primary">
              Supper
            </span>
            <span className="text-body-small text-content-primary">
              Sensible
            </span>
            <span className="text-body-small text-content-primary">
              Workmate
            </span>
            <span className="text-body-small text-content-primary">
              Ritual Dental
            </span>
          </div>

          <ProjectsList />
        </div>
      </section>

      {/* Project Cards Grid */}
      <section className="px-4 pb-10">
        <ProductGrid />
      </section>
    </main>
  );
}
