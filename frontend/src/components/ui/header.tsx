"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Header1Props {
    user?: any;
    onSignOut?: () => void;
}

function Header1({ user, onSignOut }: Header1Props = {}) {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
        {
            title: "Product",
            description: "Managing a small business today is already tough.",
            items: [
                {
                    title: "Reports",
                    href: "/reports",
                },
                {
                    title: "Statistics",
                    href: "/statistics",
                },
                {
                    title: "Dashboards",
                    href: "/dashboards",
                },
                {
                    title: "Recordings",
                    href: "/recordings",
                },
            ],
        },
        {
            title: "Company",
            description: "Managing a small business today is already tough.",
            items: [
                {
                    title: "About us",
                    href: "/about",
                },
                {
                    title: "Fundraising",
                    href: "/fundraising",
                },
                {
                    title: "Investors",
                    href: "/investors",
                },
                {
                    title: "Contact us",
                    href: "/contact",
                },
            ],
        },
    ];

    const [isOpen, setOpen] = useState(false);
    return (
        <header className="w-full z-50 fixed top-0 left-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <>
                                            <NavigationMenuLink>
                                                <Button variant="ghost" className="text-neutral-200 hover:text-white hover:bg-zinc-800">{item.title}</Button>
                                            </NavigationMenuLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger className="font-medium text-sm text-neutral-200 hover:text-white hover:bg-zinc-800">
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base text-white">{item.title}</p>
                                                            <p className="text-neutral-400 text-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <Button size="sm" className="mt-10 bg-indigo-600 hover:bg-indigo-700">
                                                            Book a call today
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-zinc-800 py-2 px-4 rounded text-neutral-200"
                                                            >
                                                                <span>{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-neutral-400" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex lg:justify-center pl-4 lg:pl-0">
                    <p className="font-semibold text-white">SerialFounder</p>
                </div>
                <div className="flex justify-end w-full gap-4">
                    {user ? (
                        <>
                            <span className="hidden md:inline text-neutral-200 self-center">
                                {user.user_metadata?.full_name || user.email}
                            </span>
                            <Button
                                variant="outline"
                                className="border-zinc-700 text-neutral-200 hover:bg-zinc-800 hover:text-white"
                                onClick={onSignOut}
                            >
                                Sair
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" className="hidden md:inline text-neutral-200 hover:text-white hover:bg-zinc-800">
                                Book a demo
                            </Button>
                            <div className="border-r border-zinc-700 hidden md:inline"></div>
                            <Button variant="outline" className="border-zinc-700 text-neutral-200 hover:bg-zinc-800 hover:text-white">Sign in</Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">Get started</Button>
                        </>
                    )}
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)} className="text-neutral-200 hover:text-white hover:bg-zinc-800">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t border-zinc-800 flex flex-col w-full right-0 bg-zinc-900/95 backdrop-blur-sm shadow-lg py-4 container gap-8">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link
                                                to={item.href}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-lg text-neutral-200">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-neutral-400" />
                                            </Link>
                                        ) : (
                                            <p className="text-lg text-neutral-200">{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    to={subItem.href}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span className="text-neutral-400">
                                                        {subItem.title}
                                                    </span>
                                                    <MoveRight className="w-4 h-4 stroke-1 text-neutral-400" />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export { Header1 };