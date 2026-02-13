"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { H3, Body } from "@leafygreen-ui/typography";
import { palette } from "@leafygreen-ui/palette";
import styles from "./NavBar.module.css"
;import { USER_MAP } from "@/lib/constants";
const NavBar = () => {
    const [userName, setUserName] = useState('User');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get the selected user from localStorage
        const selectedUser = localStorage.getItem('selectedUser');
        if (selectedUser) {
            try {
                const user = JSON.parse(selectedUser);
                // Validate that the user exists in USER_MAP
                if (USER_MAP[user.id]) {
                    setUserName(user.name);
                } else {
                    // Clear invalid user data
                    localStorage.removeItem('selectedUser');
                    setUserName('User');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('selectedUser');
            }
        }
    }, []);
    return (
        <header className={styles.navBar}>
            <div className={styles.left}>
                <Link href="/" className={styles.logoLink} aria-label="Leafy Bank home">
                    <Image src="/leafy_bank_logo.png" alt="Leafy Bank" width={200} height={36} />
                </Link>
            </div>

            <nav className={styles.center} aria-label="Main navigation">
                <Link href="/" className={styles.navLink}>
                    <Body weight="medium">My Bank</Body>
                </Link>
            </nav>

            <div className={styles.right}>
                {/* Top-right placeholder div as requested */}
                <div className={styles.topRightPlaceholder} />

                <Body>{mounted ? userName : 'User'}</Body>
            </div>
        </header>
    );
};

export default NavBar;

