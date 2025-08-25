import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { IoMenuSharp } from "react-icons/io5";

export default function drawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger>
        <IoMenuSharp className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>
          <VisuallyHidden>Navigation</VisuallyHidden>
        </DrawerTitle>
        <DrawerDescription>
          <VisuallyHidden>Navigation</VisuallyHidden>
        </DrawerDescription>
        <DrawerHeader className="px-6">
          <div className="">
            <Link href="/" title="brand-logo" className="relative mr-6 flex items-center space-x-2">
              <Icons.logo className="h-[40px] w-auto" />
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <nav>
            <ul className="mt-7 text-left">
              {siteConfig.header.map((item, index) => (
                <li key={index} className="my-3">
                  {item.trigger ? (
                    <span className="font-semibold">{item.trigger}</span>
                  ) : (
                    <Link href={item.href || ""} className="font-semibold">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </DrawerHeader>
        <DrawerFooter>
          <Link href="/login" className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "default" }),
              "text-background flex w-full gap-2 sm:w-auto"
            )}>
            <Icons.logo className="h-6 w-6" />
            Get Started for Free
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
