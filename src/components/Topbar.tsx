'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserMenu from './UserMenu';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={`px-3 py-2 text-sm font-poppins font-medium ${
                isActive
                    ? 'text-white bg-primary'
                    : 'text-text-primary hover:text-primary'
            }`}
        >
            {children}
        </Link>
    );
};

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ proyectos: [], staff: [], clientes: [] });
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query) {
                const response = await fetch(`/api/search?q=${query}`);
                const data = await response.json();
                setResults(data);
                setIsOpen(true);
            } else {
                setResults({ proyectos: [], staff: [], clientes: [] });
                setIsOpen(false);
            }
        }, 300); // 300ms delay

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !(searchRef.current as any).contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleResultClick = (type: string, id: number) => {
        setIsOpen(false);
        setQuery('');
        router.push(`/${type}/${id}`);
    };

    const hasResults = results.proyectos.length > 0 || results.staff.length > 0 || results.clientes.length > 0;

    return (
        <div className="relative hidden sm:block" ref={searchRef}>
            <MagnifyingGlassIcon className="w-5 h-5 text-text-secondary absolute top-1/2 left-3 -translate-y-1/2" />
            <input 
                type="text" 
                placeholder="Búsqueda global..." 
                className="bg-white border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && hasResults && (
                <div className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 shadow-lg">
                    <ul className="py-1">
                        {results.proyectos.length > 0 && (
                            <>
                                <li className="px-4 py-2 text-xs font-bold text-primary uppercase">Proyectos</li>
                                {results.proyectos.map((project: { id: number; nombre: string }) => (
                                    <li 
                                        key={`proj-${project.id}`}
                                        onClick={() => handleResultClick('proyectos', project.id)}
                                        className="px-4 py-2 text-sm text-text-secondary hover:bg-background cursor-pointer"
                                    >
                                        {project.nombre}
                                    </li>
                                ))}
                            </>
                        )}
                        {results.staff.length > 0 && (
                            <>
                                <li className="px-4 py-2 text-xs font-bold text-primary uppercase">Staff</li>
                                {results.staff.map((person: { id: number; nombres: string; apellidos: string; }) => (
                                    <li 
                                        key={`staff-${person.id}`}
                                        onClick={() => handleResultClick('staff', person.id)}
                                        className="px-4 py-2 text-sm text-text-secondary hover:bg-background cursor-pointer"
                                    >
                                        {`${person.nombres} ${person.apellidos}`}
                                    </li>
                                ))}
                            </>
                        )}
                        {results.clientes.length > 0 && (
                            <>
                                <li className="px-4 py-2 text-xs font-bold text-primary uppercase">Clientes</li>
                                {results.clientes.map((client: { id: number; nombre: string; }) => (
                                    <li 
                                        key={`client-${client.id}`}
                                        onClick={() => handleResultClick('clientes', client.id)}
                                        className="px-4 py-2 text-sm text-text-secondary hover:bg-background cursor-pointer"
                                    >
                                        {client.nombre}
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

const Topbar = () => {
  return (
    <header className="bg-topbar-bg shadow-md">
        <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
                {/* Left side: Logo and Main Navigation */}
                <div className="flex items-center gap-8">
                    


                </div>

                {/* Right side: Search, Icons, and User Menu */}
                <div className="flex items-center gap-4">
                    <SearchBar />

                    <UserMenu />
                </div>
            </div>
        </div>
    </header>
  );
};

export default Topbar;
