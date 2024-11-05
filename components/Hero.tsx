import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="flex p-7 mx-auto">
      <div className="flex flex-col leading-6 gap-y-6 p-4 items-center lg:items-start">
        <h1 className="text-6xl font-bold text-write">
          Work Together, Anytime, Anywhere
        </h1>
        <p className="text-lg font-medium text-neutral-400 mb-4">
          A powerful tool for teams and individuals to co-create documents online. Start collaborating effortlessly.
        </p>
        <div className="lg:w-fit md:w-3/4 w-full">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <Link href="/sign-in" className="font-bold text-lg">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
      <Image
        src="assets/icons/hero.svg"
        alt="Hero"
        width={700}
        height={900}
        className="hidden lg:block"
      />
    </div>
  )
}
