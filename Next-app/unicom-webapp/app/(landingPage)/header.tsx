import Image from "next/image";

export const Header = () => {
    return (
      <header className="h-20 w-full border-b-4 border-slate-200 ">
        
        {/* <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full"> */}
        <div className="pt-0.75 pl-9 pb-7 flex items-center gap-x-1">
          <Image src="./unicomMascot.svg" height={90} width={70} alt="Mascot" />
          <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide">UniCom</h1>
          </div>

        {/* </div> */}
      </header>
    );
  };

// import Link from 'next/link';

// export function Header() {
//   return (
//     <header className="w-full bg-gray-200 shadow-md">
//       <div className="container mx-auto p-4">
//         <nav>
//           <ul className="flex justify-center gap-6">
//             <li>
//               <Link href="/">Home</Link>
//             </li>
//             <li>
//               <Link href="/about">About</Link>
//             </li>
//             <li>
//               <Link href="/contact">Contact</Link>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// }