"use client";

import React, { useState } from 'react';
import Icon from '@leafygreen-ui/icon';
import { Modal, Container } from 'react-bootstrap';
import { H2, Subtitle, Description } from '@leafygreen-ui/typography';
import styles from './Login.module.css';
import User from '@/components/User/User';
import { USER_LIST } from "@/lib/constants";
import Banner from "@leafygreen-ui/banner";
import { useUser } from "@/lib/context/UserContext";

const Login = ({ onDone }) => {
    const { selectUser } = useUser();
    const [open, setOpen] = useState(true);
    const [selectedLocal, setSelectedLocal] = useState(null);

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
                    <Subtitle className={`${styles.weightNormal} ${styles.centerText} mt-2`}>This is a MongoDB demo</Subtitle>
                  

                    <Banner variant="warning" className={styles.warningBanner}>
                        Please make sure pop-ups are enabled in your browser to ensure the demo runs smoothly and all features display correctly.
                    </Banner>

                    <Description className={styles.descriptionModal}>
                        Please select the user you would like to login as:
                    </Description>

                    <div className={`${styles.usersContainer}`}>
                        {USER_LIST.map(user => (
                            <User
                                user={user}
                                isSelectedUser={selectedLocal && selectedLocal.id === user.id}
                                key={user.id}
                                setOpen={setOpen}
                                setLocalSelectedUser={handleUserSelect}
                            />
                        ))}
                    </div>

                    <div className={styles.parentContainer}>
                        <Banner variant="info" className="mb-3">
                            For the best experience, we recommend logging in as &quot;fridaklo&quot; or &quot;hellyrig&quot; to explore different scenarios!
                        </Banner>
                    </div>

                    <Description className={`${styles.descriptionModal} mb-3`}>
                        Note: Each user has pre-loaded data, such as recent transactions, and opened accounts. This variation is designed to showcase different scenarios, providing a more dynamic and realistic user experience for the demo.
                    </Description>
                </div>
            </Container>
        </Modal>
    );
};

export default Login;
