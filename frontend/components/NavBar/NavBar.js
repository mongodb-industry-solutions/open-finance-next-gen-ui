"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Body } from "@leafygreen-ui/typography";
import styles from "./NavBar.module.css";
import { useUser } from "@/lib/context/UserContext";

const NavBar = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Guard for SSR — UserContext reads localStorage on mount
    if (!mounted) {
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
                    <Body>User</Body>
                </div>
            </header>
        );
    }

    return <NavBarContent />;
};

const NavBarContent = () => {
    const { selectedUser, profile, setProfile, consentStatus, sourceInstitution } = useUser();
    const userName = selectedUser?.name || "User";

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
                {consentStatus === "authorized" && sourceInstitution && (
                    <span className={styles.consentBadge}>
                        Connected to {sourceInstitution}
                    </span>
                )}

                <select
                    className={styles.profileSelect}
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                >
                    <option value="balanced">Balanced</option>
                    <option value="overspender">Overspender</option>
                    <option value="saver">Saver</option>
                </select>

                <Body>{userName}</Body>
            </div>
        </header>
    );
};

export default NavBar;
