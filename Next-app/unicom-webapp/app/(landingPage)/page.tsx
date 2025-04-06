
// import Image from "next/image";
// import { Button } from "@/components/ui/button"
// import { Loader } from "lucide-react";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="max-w-[6088px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-20">
//       <div className="relative w-[640px] h-[340px] lg:w-[75vw] lg:h-[42.1875vw] mb-8 lg:mb-0">
//         {/* Hero image (the whale) */}
//         <Image src="/file.svg" fill alt="Hero" />
//       </div>
//       <div className="flex flex-col items-center gap-y-8">
//         <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[380px] text-center">
//         Roommates, Rides, and Deals – All in One Place!
//         </h1>
//         <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full" >
//               <Button size="lg" variant="secondary" className="w-full" asChild>
//                 <Link href="/form">
//                   Welcome to UniCom!
//                 </Link>
//               </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[6088px] mx-auto w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-20">
      <div className="relative w-[640px] h-[340px] lg:w-[55vw] lg:h-[36.1875vw] mb-8 lg:mb-0">
        <Image src="/file.svg" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[380px] text-center">
          Roommates, Rides, and Deals – All in One Place!
        </h1>
        <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          <Button size="lg" variant="secondary" className="w-full" asChild>
            <Link href="/form">Welcome to UniCom!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

