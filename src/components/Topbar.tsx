'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserMenu from './UserMenu';
import { useState, useEffect, useRef, useCallback } from 'react';
import { searchProjects } from '@/lib/actions';


const NavLink = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                    ? 'text-white bg-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
        >
            {children}
        </Link>
    );
};

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query) {
                const projects = await searchProjects(query);
                setResults(projects);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300); // 300ms delay

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleResultClick = (id) => {
        setIsOpen(false);
        setQuery('');
        router.push(`/proyectos/${id}`);
    };

    return (
        <div className="relative hidden sm:block" ref={searchRef}>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input 
                type="text" 
                placeholder="Buscar proyectos..." 
                className="bg-gray-100 border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && results.length > 0 && (
                <div className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1">
                        {results.map((project) => (
                            <li 
                                key={project.id}
                                onClick={() => handleResultClick(project.id)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                {project.titulo}
                            </li>
                        ))}
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
                    {/* Logo */}
                    
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logosigma.svg" alt="SIGMA CRM Logo" width={50} height={50} priority />
                        <span className="font-bold text-lg text-text-primary"></span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-4">
                        <NavLink href="/">Dashboard</NavLink>
                        <NavLink href="/proyectos">Proyectos</NavLink>
                        <NavLink href="/staff">Staff</NavLink>
                        <NavLink href="/clientes">Clientes</NavLink>
                        <NavLink href="/integraciones">Integraciones</NavLink>
                        <NavLink href="/settings">Settings</NavLink>
                    </nav>
                </div>

                {/* Right side: Search, Icons, and User Menu */}
                <div className="flex items-center gap-4">
                    <SearchBar />
                    <button className="text-gray-500 hover:text-gray-700">
                        <BellIcon className="w-6 h-6" />
                    </button>
                    <UserMenu />
                </div>
            </div>
        </div>
    </header>
  );
};

export default Topbar;