import Image from 'next/image'

export function FlagValencia({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src="/images/flags/valencia.png"
        alt="Bandera de la Comunidad Valenciana"
        fill
        className="object-cover rounded"
        sizes="(max-width: 768px) 16px, 20px"
      />
    </div>
  )
}

