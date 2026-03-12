import React, { useState, useEffect, useRef } from 'react';
import { inquiryAPI } from '../services/api';
import MessageIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/svg/ni-bell.svg'; // Use as placeholder avatar or find a user icon

const FarmerInquiries = () => {
    const [inquiries, setInquiries] = useState([]); // List of conversations
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch conversation list
    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const res = await inquiryAPI.getFarmerInquiries();
                if (res.data.success) {
                    setInquiries(res.data.inquiries);
                }
            } catch (error) {
                console.error('Error fetching inquiries:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInquiries();
    }, []);

    // Fetch messages when a conversation is selected
    useEffect(() => {
        let interval;
        if (selectedInquiry) {
            const fetchMessages = async () => {
                try {
                    const res = await inquiryAPI.getMessages(selectedInquiry.id);
                    if (res.data.success) {
                        setMessages(res.data.messages);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
            interval = setInterval(fetchMessages, 3000); // Poll every 3s
        }
        return () => clearInterval(interval);
    }, [selectedInquiry]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await inquiryAPI.reply(selectedInquiry.id, { message: newMessage });
            setNewMessage('');
            // Optimistic update
            const res = await inquiryAPI.getMessages(selectedInquiry.id);
            if (res.data.success) setMessages(res.data.messages);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '2rem', height: 'calc(100vh - 140px)' }}>

                {/* Conversations List Sidebar */}
                <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Messages
                        </h2>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner"></div></div>
                        ) : inquiries.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No inquiries yet.</p>
                        ) : (
                            inquiries.map(inquiry => (
                                <div
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: selectedInquiry?.id === inquiry.id ? '#eff6ff' : 'transparent',
                                        marginBottom: '0.5rem',
                                        transition: 'all 0.2s',
                                        border: selectedInquiry?.id === inquiry.id ? '1px solid var(--primary-color)' : '1px solid transparent',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: '600' }}>{inquiry.buyer_name}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                            {new Date(inquiry.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '500' }}>
                                        {inquiry.product_name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {inquiry.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="glass" style={{ borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white', position: 'relative' }}>
                    {selectedInquiry ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {selectedInquiry.buyer_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedInquiry.product_name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            Chat with {selectedInquiry.buyer_name} ({selectedInquiry.buyer_email})
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
                                {messages.map((msg, index) => {
                                    const isMe = msg.sender_id !== selectedInquiry.buyer_id; // If not buyer, it's me

                                    return (
                                        <div key={index} style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isMe ? 'flex-end' : 'flex-start'
                                        }}>
                                            <div style={{
                                                background: isMe ? 'var(--primary-color)' : 'white',
                                                color: isMe ? 'white' : 'var(--text-primary)',
                                                padding: '0.8rem 1.25rem',
                                                borderRadius: '1.25rem',
                                                borderBottomRightRadius: isMe ? '2px' : '1.25rem',
                                                borderBottomLeftRadius: isMe ? '1.25rem' : '2px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                lineHeight: '1.5'
                                            }}>
                                                {msg.message}
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem', padding: '0 0.5rem' }}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        style={{
                                            flex: 1,
                                            padding: '0.85rem 1.25rem',
                                            borderRadius: '2rem',
                                            border: '1px solid #cbd5e1',
                                            outline: 'none',
                                            fontSize: '0.95rem',
                                            transition: 'border-color 0.2s',
                                            background: '#f8fafc'
                                        }}
                                        className="chat-input"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '0 1.5rem',
                                            borderRadius: '2rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            opacity: !newMessage.trim() ? 0.7 : 1
                                        }}
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>💬</div>
                            <p style={{ fontSize: '1.1rem' }}>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default FarmerInquiries;
