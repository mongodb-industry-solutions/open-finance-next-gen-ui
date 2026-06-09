"use client";

import React, { useState } from 'react';
import Icon from '@leafygreen-ui/icon';
import { Modal, Container } from 'react-bootstrap';
import { H2, Subtitle, Description } from '@leafygreen-ui/typography';
import styles from './Login.module.css';
import User from '@/components/User/User';
import { USER_LIST } from "@/lib/constants";
import Banner from "@leafygreen-ui/banner";
import Badge from "@leafygreen-ui/badge";
import { useUser } from "@/lib/context/UserContext";

const UserHorizontal = ({ user, isSelectedUser, onSelect }) => (
    <div
        onClick={() => onSelect(user)}
        className={`${styles.userHorizontalCard} ${isSelectedUser ? styles.selected : ''}`}
    >
        <div className={`${styles.userHorizontalAvatar} ${isSelectedUser ? styles.selected : ''}`}>
            <img src={`/users/${user.id}.png`} alt={user.name} />
        </div>
        <div className={styles.userHorizontalInfo}>
            <span className={styles.userHorizontalName}>{user.name}</span>
            <span className={styles.userHorizontalRole}>{user.role}</span>
        </div>
    </div>
);

const Login = ({ onDone }) => {
    const { selectUser } = useUser();
    const [open, setOpen] = useState(true);
    const [selectedLocal, setSelectedLocal] = useState(null);

    const retailUsers = USER_LIST.filter(u => u.section === 'retail');
    const backofficeUsers = USER_LIST.filter(u => u.section === 'backoffice');

    const handleUserSelect = (user) => {
        setSelectedLocal(user);
        selectUser(user);
        setOpen(false);
        onDone?.();
    };

    return (
        <Modal
            show={open}
            onHide={() => {
                if (!selectedLocal) {
                    alert("You must select a user before proceeding!");
                    return;
                }
                setOpen(false);
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            fullscreen={'md-down'}
            className={styles.leafyFeel}
            backdrop="static"
        >
            <Container className={styles.modalContainer}>
                <div
                    className={`d-flex flex-row-reverse p-1 cursorPointer ${!selectedLocal ? styles.disabledCloseButton : ''}`}
                    onClick={() => {
                        if (!selectedLocal) {
                            alert("You must select a user before proceeding!");
                        } else {
                            setOpen(false);
                        }
                    }}
                >
                    <Icon glyph="X" />
                </div>

                <div className={styles.modalMainContent}>
                    <H2 className={styles.centerText}>Welcome to Leafy Bank</H2>

                    <Description className={styles.descriptionModal}>
                        Please select the user you would like to login as:
                    </Description>

                    {/* ── RETAIL ── */}
                    <Badge variant="blue" className={styles.badgeInfo}>RETAIL USERS</Badge>

                    <div className={styles.retailUsersContainer}>
                        {retailUsers.map(user => (
                            <UserHorizontal
                                user={user}
                                isSelectedUser={selectedLocal && selectedLocal.id === user.id}
                                key={user.id}
                                onSelect={handleUserSelect}
                            />
                        ))}
                    </div>

                    {/* ── BACKOFFICE ── */}
                    <Badge variant="purple" className={styles.badgeInfo}>BACKOFFICE USERS</Badge>

                    <div className={styles.usersContainer}>
                        {backofficeUsers.map(user => (
                            <User
                                user={user}
                                isSelectedUser={selectedLocal && selectedLocal.id === user.id}
                                key={user.id}
                                setOpen={setOpen}
                                setLocalSelectedUser={handleUserSelect}
                            />
                        ))}
                    </div>

                    <Banner variant="warning" className={styles.warningBanner}>
                        Please make sure pop-ups are enabled in your browser to ensure the demo runs smoothly and all features display correctly.
                    </Banner>

                </div>
            </Container>
        </Modal>
    );
};

export default Login;