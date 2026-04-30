"use client";
import React from 'react';
import Image from "next/image";

export const Logo = ({className}: { className?: string }) => {
    return (
        <div className={`flex items-center space-x-2 font-bold text-xl text-gray-800 dark:text-white ${className}`}>
            <Image src={"/polodev-logo.jpg"} alt={"Polodev Logo"} width={40} height={40} className="rounded-full"/>
            <span>Polodev</span>
        </div>
    )
};