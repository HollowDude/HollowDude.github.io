import '../globals.css'

export default function PiercLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}