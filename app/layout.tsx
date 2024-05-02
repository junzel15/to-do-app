import React from "react";
import Navigation from "../components/Navigation";
import "./globals.css";
console.log(
  "process.env.NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <html lang="en">
        <body>
          <Navigation />
          {children}
        </body>
      </html>
    </>
  );
};

export default Layout;
