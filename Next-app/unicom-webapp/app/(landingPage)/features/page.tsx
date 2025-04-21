import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full bg-white flex items-center">
      <div className="max-w-5xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-8 lg:py-12 gap-24 w-full">
        {/* LEFT SIDE: TEXT */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-neutral-900">
            Connect with your <span className="text-[#f4600c]">RIT</span> community
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Find roommates, sell items, arrange carpools, and more – all in one place,
            exclusively for RIT students. It’s like a full-stack solution to your college chaos — no semicolons, no bugs, just roommates and rides.
          </p>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="bg-[#f4600c] hover:bg-[#e25500] text-white font-semibold shadow-md"
            >
              <Link href="/feed" className="w-full h-full flex items-center justify-center">
                Get Started
              </Link>
            </Button>
            <Button
              size="lg"
              variant="primaryOutline"
              className="border-[#f4600c] text-[#f4600c] hover:bg-orange-50 font-semibold"
            >
              <Link href="/features" className="w-full h-full flex items-center justify-center">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE: SMALLER IMAGE CARD */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-sm h-64 sm:h-80 lg:h-[550px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/landing.png"
              alt="Students using UniCom"
              fill
              priority
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}