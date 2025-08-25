"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {siteConfig.header.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.trigger ? (
              <>
                <NavigationMenuTrigger>{item.trigger}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={`grid gap-3 p-6 ${
                      item.content.main
                        ? "md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
                        : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                    }`}>
                    {item.content.main && (
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="bg-primary/10 from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md p-6 no-underline outline-none select-none focus:shadow-md"
                            href={item.content.main.href}>
                            {item.content.main.icon}
                            <div className="mt-4 mb-2 text-lg font-medium">{item.content.main.title}</div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              {item.content.main.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    )}
                    {item.content.items.map((subItem, subIndex) => (
                      <ListItem
                        key={subIndex}
                        href={subItem.href}
                        title={subItem.title}
                        className="hover:bg-primary/10">
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={item.href || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navigationMenuTriggerStyle()}>
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
              className
            )}
            {...props}>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";
