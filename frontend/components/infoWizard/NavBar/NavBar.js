"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { H3, Body } from "@leafygreen-ui/typography";
import { palette } from "@leafygreen-ui/palette";
import styles from "./NavBar.module.css";

const NavBar = () => {
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

                <Body> Rachel McAllister
                </Body>
            </div>
        </header>
    );
};

export default NavBar;

