"use client";

import Link from 'next/link';

export default function WaitingList() {
    return (
        <div className="waiting-list-page">
            <div className="overlay" />

            <div className="content-wrapper">
                <div className="center-content">
                    <h1 className="main-title">TANDLOS</h1>
                    <p className="sub-title">WHAT YOU ARE SEARCHING FOR ISN'T OUT THERE IT'S IN HERE </p>

                    <Link href="/shop" className="shop-button">
                        SHOP NOW
                    </Link>
                </div>

                <div className="footer-credit">
                    <p>Developed by @Kareem Taha</p>
                </div>
            </div>

            <style jsx>{`
                .waiting-list-page {
                    position: relative;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    color: #fff;
                    background-image: url("/background-v2.jpg");
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    font-family: var(--font-outfit), sans-serif;
                }
                
                .overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
                    z-index: 0;
                }

                .content-wrapper {
                    position: relative;
                    z-index: 1;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .center-content {
                    text-align: center;
                    animation: fadeIn 1.5s ease-out;
                }

                .main-title {
                    font-family: var(--font-family-heading);
                    font-size: clamp(3rem, 10vw, 6rem);
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 0 30px rgba(255,255,255,0.2);
                    line-height: 1;
                }

                .sub-title {
                    font-size: clamp(0.7rem, 2vw, 1rem);
                    letter-spacing: 0.5em;
                    text-transform: uppercase;
                    opacity: 0.7;
                    margin-bottom: 3rem;
                    font-weight: 300;
                }

                .shop-button {
                    display: inline-block;
                    padding: 1.2rem 3.5rem;
                    background-color: transparent;
                    border: 1px solid #fff;
                    color: #fff;
                    font-family: var(--font-family-heading);
                    font-size: 1rem;
                    font-weight: 600;
                    letter-spacing: 0.2rem;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                    overflow: hidden;
                }

                .shop-button:hover {
                    background-color: #fff;
                    color: #000;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .footer-credit {
                    position: absolute;
                    bottom: 30px;
                    opacity: 0.4;
                    font-size: 0.7rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .main-title { letter-spacing: 0.15em; }
                    .sub-title { letter-spacing: 0.3em; }
                    .shop-button { padding: 1rem 2.5rem; }
                }
            `}</style>
        </div>
    );
}
