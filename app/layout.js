export const metadata = {
  title: "MedaStaré",
  description: "MedaStaré website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
