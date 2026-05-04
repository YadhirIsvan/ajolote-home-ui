const PARTNERS = [
  "Infonavit",
  "BBVA",
  "Scotiabank",
  "Banorte",
  "HSBC",
  "Santander",
  "Fovissste",
  "Cofinavit",
];

const TrustBar = () => (
  <section className="py-6 border-b border-border/30 bg-background overflow-hidden">
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll-x">
        {[...PARTNERS, ...PARTNERS].map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
          >
            <span className="text-sm md:text-base font-semibold text-foreground/20 hover:text-foreground/60 transition-colors duration-500 whitespace-nowrap tracking-wide select-none cursor-default">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
