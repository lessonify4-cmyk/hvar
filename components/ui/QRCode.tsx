import { cn } from '@/lib/utils'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 200, className }: QRCodeProps) {
  // We display the QR value as a styled monospace code block
  // In production, integrate a QR library like qrcode.react
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-3 p-4 bg-white border border-border rounded-card',
        className
      )}
    >
      {/* QR Grid placeholder — replace with actual QR library in production */}
      <div
        style={{ width: size, height: size }}
        className="bg-mist border border-border rounded flex items-center justify-center p-4"
        aria-label={`QR code for ticket: ${value}`}
      >
        <div className="text-center">
          <div className="grid grid-cols-5 gap-1 mb-3" aria-hidden="true">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{ background: Math.random() > 0.4 ? '#0F0E0C' : 'transparent' }}
              />
            ))}
          </div>
          <p className="font-mono text-xs text-ink break-all">{value}</p>
        </div>
      </div>
      <p className="text-xs text-muted font-medium tracking-wider uppercase">Ticket QR Code</p>
    </div>
  )
}
