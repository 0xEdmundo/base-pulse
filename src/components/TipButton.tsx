'use client';

import { useState, useEffect } from 'react';
import { TIP_CONFIG } from '@/lib/config';
import sdk from '@farcaster/frame-sdk';

// Get tip settings from config
const TIP_CONTRACT_ADDRESS = TIP_CONFIG.contractAddress;
const TIP_AMOUNTS = TIP_CONFIG.amounts;

interface TipButtonProps {
    className?: string;
}

export default function TipButton({ className = '' }: TipButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInFrame, setIsInFrame] = useState(false);
    const [ethProvider, setEthProvider] = useState<any>(null);

    // Check if running in Farcaster Frame and get provider
    useEffect(() => {
        const checkFrame = async () => {
            try {
                // Check if we're in an iframe (Farcaster Frame)
                const inFrame = typeof window !== 'undefined' && window.self !== window.top;
                setIsInFrame(inFrame);

                if (inFrame) {
                    // Try to get Farcaster ethereum provider
                    const provider = await sdk.wallet.ethProvider;
                    if (provider) {
                        setEthProvider(provider);
                    }
                }
            } catch (error) {
                console.log('Not in Farcaster Frame');
            }
        };

        checkFrame();
    }, []);

    // Send tip using available provider
    const handleTip = async (amount: string) => {
        setIsLoading(true);

        try {
            const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
            const valueHex = '0x' + amountInWei.toString(16);

            // Try Farcaster provider first if available
            if (isInFrame && ethProvider) {
                try {
                    const accounts = await ethProvider.request({ method: 'eth_requestAccounts' });

                    if (accounts && accounts.length > 0) {
                        // Send transaction via Farcaster wallet
                        const txHash = await ethProvider.request({
                            method: 'eth_sendTransaction',
                            params: [{
                                from: accounts[0],
                                to: TIP_CONTRACT_ADDRESS,
                                value: valueHex,
                            }],
                        });

                        alert(`Tip gönderildi! 🎉\nTx: ${txHash.slice(0, 10)}...`);
                        setIsOpen(false);
                        return;
                    }
                } catch (e) {
                    console.log('Farcaster wallet failed, falling back to browser wallet');
                }
            }

            // Fallback to browser wallet (Coinbase Wallet, MetaMask, etc.)
            if (typeof window !== 'undefined' && window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });

                if (!accounts || accounts.length === 0) {
                    alert('Cüzdan bağlantısı reddedildi');
                    return;
                }

                // Switch to Base network if needed
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== '0x2105') {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x2105' }],
                        });
                    } catch (switchError: any) {
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: '0x2105',
                                    chainName: 'Base',
                                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                                    rpcUrls: ['https://mainnet.base.org'],
                                    blockExplorerUrls: ['https://basescan.org'],
                                }],
                            });
                        } else {
                            throw switchError;
                        }
                    }
                }

                // Send transaction
                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: accounts[0],
                        to: TIP_CONTRACT_ADDRESS,
                        value: valueHex,
                    }],
                });

                alert(`Tip gönderildi! 🎉\nTx: ${txHash.slice(0, 10)}...`);
                setIsOpen(false);
            } else {
                // No wallet - open Coinbase Wallet
                window.open('https://www.coinbase.com/wallet', '_blank');
            }
        } catch (error: any) {
            console.error('Tip error:', error);
            if (error.code !== 4001) {
                alert('Tip gönderilemedi: ' + (error.message || 'Bilinmeyen hata'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`tip-container ${className}`}>
            <button
                className="tip-button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
            >
                <span className="tip-icon">💎</span>
                <span className="tip-label">Tip</span>
            </button>

            {isOpen && (
                <div className="tip-dropdown">
                    <div className="tip-header">
                        <span>Base Pulse&apos;a Destek Ol</span>
                        <button className="tip-close" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    {/* Wallet indicator */}
                    <div className="tip-wallet-info">
                        {isInFrame ? (
                            <span>🟣 Farcaster Cüzdanı</span>
                        ) : (
                            <span>🔵 Coinbase / Web3 Cüzdan</span>
                        )}
                    </div>

                    <div className="tip-amounts">
                        {TIP_AMOUNTS.map((tip) => (
                            <button
                                key={tip.value}
                                className="tip-amount-btn"
                                onClick={() => handleTip(tip.value)}
                                disabled={isLoading}
                            >
                                {tip.label} ETH
                            </button>
                        ))}
                    </div>
                    <div className="tip-footer">
                        <span>Base Ağı üzerinden</span>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="tip-loading">
                    <span className="loading-spinner"></span>
                </div>
            )}
        </div>
    );
}

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on?: (event: string, callback: (...args: any[]) => void) => void;
            removeListener?: (event: string, callback: (...args: any[]) => void) => void;
            isCoinbaseWallet?: boolean;
        };
    }
}
