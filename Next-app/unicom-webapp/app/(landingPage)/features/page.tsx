"use client";

import { Home, ShoppingBag, Car, Users, Search } from "lucide-react";

export default function FeaturesPage() {
  return (
    <main className="flex justify-center items-center w-full">
      <FeaturesSection />
    </main>
  );
}

const FeaturesSection = () => {
  return (
    <section
      className="w-full py-16 md:py-24 lg:py-32 bg-white"
      id="features"
      aria-label="Key Features"
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Key Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to connect with your university community
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          <FeatureCard
            icon={<Home className="h-8 w-8" />}
            title="Roommate Search"
            description="Find the perfect roommate match through detailed profiles and preferences"
            bg="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <FeatureCard
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Buy & Sell"
            description="Buy and sell items easily within the university community"
            bg="bg-gradient-to-br from-pink-500 to-pink-700"
          />
          <FeatureCard
            icon={<Car className="h-8 w-8" />}
            title="Carpooling"
            description="Share rides and split costs with fellow students heading the same way"
            bg="bg-gradient-to-br from-yellow-500 to-yellow-700"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="RIT Email Only"
            description="Secure platform exclusively for verified university students"
            bg="bg-gradient-to-br from-indigo-500 to-indigo-700"
          />
          <FeatureCard
            icon={<Search className="h-8 w-8" />}
            title="Smart Search"
            description="Find exactly what you need with our intelligent search functionality"
            bg="bg-gradient-to-br from-cyan-500 to-cyan-700"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg: string;
}) => {
  return (
    <article className="flex flex-col items-center text-center rounded-xl border border-gray-200 p-8 shadow-lg transition-transform hover:scale-[1.03] hover:shadow-2xl max-w-sm">
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${bg} text-white shadow-md`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </article>
  );
};
