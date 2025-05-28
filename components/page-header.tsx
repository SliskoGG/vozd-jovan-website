interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              filter: "brightness(0.4)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="absolute inset-0 bg-noise opacity-10" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-wider text-white">{title.toUpperCase()}</h1>
        {subtitle && <p className="text-lg md:text-xl text-gray-300 font-light">{subtitle}</p>}
      </div>
    </section>
  )
}
