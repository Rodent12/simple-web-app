export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>My Next.js App</h1>
          <nav>
            <a href="/">Home</a> | <a href="/about">About</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>© 2024 My Next.js App</footer>
      </body>
    </html>
  );
}
