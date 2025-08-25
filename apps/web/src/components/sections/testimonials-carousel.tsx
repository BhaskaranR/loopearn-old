import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { MdOutlineFormatQuote } from "react-icons/md";

const companies = ["Google", "Microsoft", "Amazon", "Netflix", "YouTube", "Instagram", "Uber", "Spotify"];

export default function Component() {
  return (
    <Section title="Testimonial Highlight" subtitle="What our customers are saying">
      <Carousel>
        <div className="relative mx-auto max-w-2xl">
          <CarouselContent>
            {Array.from({ length: 7 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-2 pb-5">
                  <div className="text-center">
                    <MdOutlineFormatQuote className="text-themeDarkGray mx-auto my-4 text-4xl" />
                    <BlurFade delay={0.25} inView>
                      <h4 className="text-1xl mx-auto max-w-lg px-10 font-semibold">
                        There is a lot of exciting stuff going on in the stars above us that make astronomy so
                        much fun. The truth is the universe is a constantly changing, moving, some would say
                        “living” thing because you just never know what you are going to see on any given
                        night of stargazing.
                      </h4>
                    </BlurFade>
                    <BlurFade delay={0.25 * 2} inView>
                      <div className="mt-8">
                        <Image
                          width={0}
                          height={40}
                          key={index}
                          src={`https://cdn.magicui.design/companies/${
                            companies[index % companies.length]
                          }.svg`}
                          alt={`${companies[index % companies.length]} Logo`}
                          className="mx-auto h-[40px] w-auto opacity-30 grayscale"
                        />
                      </div>
                    </BlurFade>
                    <div className="">
                      <BlurFade delay={0.25 * 3} inView>
                        <h4 className="text-1xl my-2 font-semibold">Leslie Alexander</h4>
                      </BlurFade>
                    </div>
                    <BlurFade delay={0.25 * 4} inView>
                      <div className="mb-3">
                        <span className="text-themeDarkGray text-sm">UI Designer</span>
                      </div>
                    </BlurFade>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 h-full w-2/12 bg-gradient-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 h-full w-2/12 bg-gradient-to-l"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 md:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </Section>
  );
}
