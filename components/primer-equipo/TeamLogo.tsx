import Image from 'next/image'

type TeamLogoProps = {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10 sm:w-12 sm:h-12',
  md: 'w-14 h-14 sm:w-16 sm:h-16',
  lg: 'w-16 h-16 sm:w-20 sm:h-20',
}

export function TeamLogo({ src, alt, size = 'md' }: TeamLogoProps) {
  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full bg-white border-2 border-red-100 shadow-sm overflow-hidden flex-shrink-0`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-contain p-1" sizes="80px" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase text-center px-1">
          {alt.slice(0, 3)}
        </div>
      )}
    </div>
  )
}
