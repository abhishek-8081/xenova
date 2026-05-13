import { useEffect, useState, useRef } from "react"

interface OrderBookData {
    bids: [string, string][];
    asks: [string, string][];
    symbol: string;
    timestamp: number;
}

export const useWs = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    
    useEffect(() => {
        const connect = () => {
            try {
                const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://159.65.156.97:3001";
                console.log('Connecting to WebSocket at:', WS_URL);
                const ws = new WebSocket(WS_URL);
                wsRef.current = ws;
                
                ws.onopen = () => {
                    setIsConnected(true);
                    console.log('WebSocket connected to Xenova Broadcaster');
                };
                
                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        
                        // Handle price update (bookTicker format)
                        if (data.b || data.a) {
                            const orderBookData = {
                                bids: [[data.b, data.B || "0"]],
                                asks: [[data.a, data.A || "0"]],
                                symbol: data.s || 'BTC_USDC',
                                timestamp: Date.now()
                            };
                            setOrderBook(orderBookData as any);
                            
                            // Also add to messages for the ticker
                            setMessages((prev) => [JSON.stringify({
                                data: {
                                    s: data.s || 'BTC_USDC',
                                    p: data.b, // Use bid as price for now
                                    q: data.B || "0"
                                }
                            }), ...prev.slice(0, 99)]);
                        }
                    } catch (error) {
                        console.error('💥 Failed to parse WebSocket message:', error, event.data);
                    }
                };
                
                ws.onclose = () => {
                    setIsConnected(false);
                    console.log('WebSocket disconnected, attempting to reconnect...');
                    setTimeout(connect, 3000);
                };
                
                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setIsConnected(false);
                };
                
            } catch (error) {
                console.error('Failed to connect to WebSocket:', error);
                setIsConnected(false);
                setTimeout(connect, 3000);
            }
        };

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return { messages, orderBook, isConnected };
}