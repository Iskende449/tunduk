import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RefreshCw,
    Home,
    FileText,
    LayoutGrid,
    User,
    ChevronLeft,
    QrCode,
    CreditCard,
    GraduationCap,
    RotateCcw
} from 'lucide-react';

import frontImg from './assets/front.jpg';
import backImg from './assets/back.jpg';
import qrImg from './assets/qr.png';
import mainLogo from './assets/image.png';

const App = () => {
    const [view, setView] = useState('menu');
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [timer, setTimer] = useState(166);
    const [tempPass, setTempPass] = useState('324608');

    useEffect(() => {
        let interval;
        if (isSheetOpen) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 0) {
                        setTempPass(Math.floor(100000 + Math.random() * 900000).toString());
                        return 166;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSheetOpen]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min} мин ${sec < 10 ? '0' + sec : sec} секунд`;
    };

    const menuItems = [
        {
            id: 'id-card',
            title: 'Идентификационная карта',
            icon: <CreditCard size={24} strokeWidth={2.5} />,
            active: true
        },
        {
            id: 'driver-license',
            title: 'Водительское удостоверение',
            icon: <RotateCcw size={24} strokeWidth={2.5} />,
            active: false
        },
        {
            id: 'edu-cert',
            title: 'Свидетельство об основном общем образовании',
            icon: <GraduationCap size={24} strokeWidth={2.5} />,
            active: false
        },
    ];

    return (
        <div className="app">
            <AnimatePresence mode="wait">
                {view === 'menu' ? (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="menu-container"
                    >
                        <div className="menu-header">
                            <h1 className="menu-title">Документы</h1>
                            <div className="refresh-icon-btn">
                                <RefreshCw size={22} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="doc-list">
                            {menuItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="doc-item"
                                    onClick={() => item.active && setView('doc')}
                                >
                                    <div className="doc-icon-box">{item.icon}</div>
                                    <span className="doc-text">{item.title}</span>
                                </div>
                            ))}
                        </div>

                        <BottomNav active="docs" openSheet={() => setIsSheetOpen(true)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="doc"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="doc-view-container"
                    >
                        <div className="doc-header">
                            <button className="back-btn" onClick={() => setView('menu')}>
                                <ChevronLeft size={30} strokeWidth={2.5} />
                            </button>
                            <div className="doc-header-title">Идентификационная карта</div>
                            <div className="header-spacer"></div>
                        </div>

                        <div className="bg-pattern" style={{ opacity: 0.1, filter: 'brightness(0) invert(1)' }}>
                            <img src={mainLogo} alt="pattern" width="100%" height="100%" />
                        </div>

                        <div className="card-stack">
                            <div className="id-card-wrapper">
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.div
                                        key={activeCardIndex}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(e, info) => {
                                            if (Math.abs(info.offset.x) > 50) {
                                                setActiveCardIndex(prev => prev === 0 ? 1 : 0);
                                            }
                                        }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="id-card"
                                    >
                                        <img src={activeCardIndex === 0 ? frontImg : backImg} alt="ID" draggable="false" />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Visual back card */}
                                <div className="id-card behind">
                                    <img src={activeCardIndex === 0 ? backImg : frontImg} alt="ID" draggable="false" />
                                </div>
                            </div>
                        </div>

                        <div className="dots-container">
                            <div className={`dot-item ${activeCardIndex === 0 ? 'dash' : 'circle'}`} />
                            <div className={`dot-item ${activeCardIndex === 1 ? 'dash' : 'circle'}`} />
                        </div>

                        <div className="bottom-pull-container" onClick={() => setIsSheetOpen(true)}>
                            <div className="pull-qr-btn">
                                <div className="pull-qr-btn-circle">
                                    <QrCode size={30} />
                                </div>
                            </div>
                            <div className="pull-label">Потяните для просмотра QR кода</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                timer={timer}
                tempPass={tempPass}
                qrImg={qrImg}
                formatTime={formatTime}
            />
        </div>
    );
};

const BottomNav = ({ active, openSheet }) => {
    return (
        <div className="bottom-nav">
            <div className={`nav-item ${active === 'home' ? 'active' : ''}`}>
                <Home size={24} strokeWidth={2} />
                <span className="nav-label">Главная</span>
            </div>
            <div className={`nav-item ${active === 'docs' ? 'active' : ''}`}>
                <FileText size={24} strokeWidth={3} />
                <span className="nav-label">Документы</span>
            </div>

            <div className="qr-btn-main" onClick={openSheet}>
                <QrCode size={32} />
            </div>

            <div className={`nav-item ${active === 'services' ? 'active' : ''}`}>
                <LayoutGrid size={24} strokeWidth={2} />
                <span className="nav-label">Услуги</span>
            </div>
            <div className={`nav-item ${active === 'cabinet' ? 'active' : ''}`}>
                <User size={24} strokeWidth={2} />
                <span className="nav-label">Кабинет</span>
            </div>
        </div>
    );
};

const Sheet = ({ isOpen, onClose, timer, tempPass, qrImg, formatTime }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="sheet-overlay"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="sheet"
                    >
                        <div className="sheet-bar"></div>

                        <div className="qr-box">
                            <div className="qr-img" style={{ backgroundImage: `url(${qrImg})` }}></div>
                        </div>

                        <div className="timer">
                            <div className="timer-bar">
                                <motion.div
                                    className="timer-fill"
                                    animate={{ width: `${(timer / 166) * 100}%` }}
                                    transition={{ ease: 'linear' }}
                                />
                            </div>
                            <div className="timer-lbl">
                                До истечения действия временного QR-кода осталось {formatTime(timer)}
                            </div>
                        </div>

                        <div className="sh-title">QR-код цифрового документа</div>
                        <div className="sh-sub">Чтобы поделиться данными необходимо сообщить следующую информацию:</div>

                        <div className="data-grid">
                            <div>
                                <div className="data-lbl">ПИН:</div>
                                <div className="data-val">20103200650744</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="data-lbl">Временный пароль</div>
                                <div className="data-val" style={{ fontFamily: 'monospace', fontSize: '24px' }}>{tempPass}</div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default App;
