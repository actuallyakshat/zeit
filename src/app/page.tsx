import { Button } from "@/components/ui/button";
import CTAButton from "@/components/ui/cta-button";
import PronunciationButton from "@/components/ui/pronunciation-button";
import { SeparatorBorder } from "@/components/ui/seperator";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { ItemCard } from "./(dashboard)/components/items-list";
import { WishlistItem } from "@/service/wishlist-item/wishlist-item";

export default function Home() {
  return (
    <div className="max-w-screen-lg px-5 w-full h-screen flex flex-col mx-auto">
      <CTASection />
      <SeparatorBorder className="h-7" />
      <Features />
    </div>
  );
}

function Features() {
  const features = [
    {
      title: "Time-Based Insights",
      description:
        "See how much time you'll need to work to afford each item on your wishlist, based on your monthly income.",
    },
    {
      title: "Smart Budgeting",
      description:
        "Prioritize purchases by comparing the time cost of items and make smarter spending decisions.",
    },
    {
      title: "Chrome Extension",
      description:
        "Manage your wishlist without ever leaving your favourite shopping website.",
    },
  ];

  return (
    <div className="flex-[1] p-10 grid grid-cols-3 border-x border-dashed gap-4 md:grid">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  readonly title: string;
  readonly description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function CTASection() {
  return (
    <div className="flex-[4] p-12 border-x border-dashed">
      <h1 className="2xl:text-8xl xl:text-7xl md:text-6xl sm:text-4xl text-3xl mt-4 tracking-tight text-balance">
        Your Wishlist, <br />
        Measured in Time.
      </h1>

      <p className="flex mt-4 mb-3 text-lg items-center gap-1.5">
        Introducing <span className="font-semibold">Zeit</span>
        <PronunciationButton />
        <em>Zeit</em> (pronounced <em>/tsaɪt/</em>, like “tsite”)
      </p>

      <p className=" text-lg text-muted-foreground max-w-xl">
        Transform your shopping wishlist into a time-saving plan. Prioritize
        your desires and make every moment count.
      </p>
      <div className="mt-8 flex gap-3">
        <CTAButton />
        <Button variant={"outline"} className="" asChild>
          <Link href="https://github.com/actuallyakshat/zeit" target="_blank">
            Got ideas for Zeit? Contribute Today <GithubIcon />
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <LandingItemCardsSection />
      </div>
    </div>
  );
}

const items: WishlistItem[] = [
  {
    title: "iPhone 17 Air",
    description: "Curious about the bend test really.",
    url: "https://www.apple.com/in/iphone-air/",
    imageUrl:
      "https://www.apple.com/v/iphone/home/ce/images/overview/select/iphone_air__f0t56fef3oey_large_2x.jpg",
    price: 119900,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchased: false,
    id: "preview-id",
    userId: "preview-user",
  },
  {
    title: "Bottega Veneta Bag",
    description: "Ciao Ciao, Autumn handbag because why not",
    url: "https://www.bottegaveneta.com/en-us/ciao-ciao-autumn-fondant-836083V5QB08354.html",
    imageUrl:
      "https://bottega-veneta.dam.kering.com/m/25836dbf1df8bdfb/Large-836083V5QB08354_A.jpg?v=1",
    price: 556122.96,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchased: false,
    id: "preview-id",
    userId: "preview-user",
  },
  {
    title: "Trip to London",
    description: "Anything to catch a game at the Emirates Stadium",
    url: "https://example.com/item",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/6397e1ebbb148c2e8ac0b037/28bd2e1a-71d4-4dbf-b8a9-b34bdee409a8/London_1_2019-4508.jpg",
    price: 230000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchased: false,
    id: "preview-id",
    userId: "preview-user",
  },
];

function LandingItemCardsSection() {
  return (
    <div className="items-grid gap-4">
      {items.map((item, index) => (
        <ItemCard key={item.title} index={index} item={item} preview={true} />
      ))}
    </div>
  );
}
