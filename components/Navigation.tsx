import React from "react";
import Link from "next/link";

const Navigation: React.FC = () => {
  return (
    <header>
      <div className="logo">TO DO APP</div>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
