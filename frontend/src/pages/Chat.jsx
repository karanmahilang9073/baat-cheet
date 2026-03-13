import { useState, useEffect, useRef } from 'react'
import {useAuth} from '../context/authContext'
import {useChat} from '../context/ChatContext'
import { useNavigate } from 'react-router-dom'

import CreateConversationModal from '../components/CreateConversationModal'


const Chat = () => {
    const [messageText, setMessageText] = useState('')
    const [showModal, setShowModal] = useState(false)
    const scrollRef = useRef(null)
    const navigate = useNavigate()

    const {conversations, currentConversation,getUserConversations,loading,error, selectConversation, messages, sendMessage } = useChat()
    const {user, logout, loading: authLoading} = useAuth()

    useEffect(()=>{
        if(user && !authLoading) getUserConversations()
    },[user, authLoading])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour : "smooth"})
    }, [messages])

    const handleMessage = (e) =>{
        e.preventDefault()
        if(!messageText.trim()) return;

        sendMessage({
            conversationId : currentConversation._id,
            text : messageText,
            sender : user
        })
        setMessageText('')
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Get conversation display name - for 1-on-1 chats, show the other user's name
    const getConversationName = (conv) => {
        if (conv.name) {
            return conv.name; // Group chat - use the group name
        }
        // One-on-one chat - find the other user
        if (conv.members && Array.isArray(conv.members)) {
            const otherUser = conv.members.find(member => 
                typeof member === 'object' ? member._id !== user?._id : member !== user?._id
            );
            if (otherUser) {
                return typeof otherUser === 'object' ? otherUser.username : otherUser;
            }
        }
        return "Untitled Chat";
    }

  return (
    <div className='flex h-screen bg-gray-50'>
        {/* Navbar */}
        <nav className='fixed top-0 left-0 right-0 bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg z-50'>
            <div className='px-6 py-4 flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    <div className='bg-white bg-opacity-20 p-2 rounded-lg'>
                        <span className='text-2xl font-bold'>💬</span>
                    </div>
                    <h1 className='text-2xl font-bold'>Batcheet</h1>
                </div>
                {user && (
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg'>
                            <img src={user.avatar} alt={user.username} className='w-8 h-8 rounded-full border-2 border-white' />
                            <div className='hidden sm:block'>
                                <p className='text-sm font-semibold'>{user.username}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition'
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>

        {/* left sidebar */}
        <aside className='w-72 border-r border-gray-200 pt-20 bg-white flex flex-col overflow-hidden shadow-sm'>
            {/* Create chat button */}
            <button 
                onClick={()=>setShowModal(true)} 
                className='m-4 px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition flex items-center justify-center space-x-2 shadow-md'
            >
                <span className='text-lg'>+</span>
                <span>New Chat</span>
            </button>

            {/* conversations */}
            <div className='px-4 pb-2'>
                <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>Conversations</h3>
            </div>

            {loading && (
                <p className='text-sm text-gray-500 px-4'>Loading conversations...</p>
            )}

            {error && (
                <p className='text-sm text-red-500 px-4'>{error}</p>
            )}

            {!loading && conversations.length === 0 && (
                <p className='text-sm text-gray-500 px-4'>No conversations yet</p>
            )}

            <ul className='overflow-y-auto flex-1 px-2'>
                {conversations.map((conv)=>(
                    <li 
                        key={conv._id} 
                        onClick={()=>selectConversation(conv)} 
                        className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition flex items-center space-x-3 mb-2
                            ${currentConversation?._id === conv._id 
                                ? "bg-linear-to-r from-blue-100 to-purple-100 text-blue-900 border-l-4 border-blue-600" 
                                : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <span className='text-lg'>💬</span>
                        <span className='truncate'>{getConversationName(conv)}</span>
                    </li>
                ))}
            </ul>
        </aside>

        {/* right main area  */}
        <main className='flex-1 pt-20 flex flex-col bg-gray-50'>
            {currentConversation ? (
                <>
                    {/* Header */}
                    <div className='border-b border-gray-200 bg-white px-6 py-4 shadow-sm'>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            {currentConversation.name || "Chat"}
                        </h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                        </p>
                    </div>

                    {/* message display  */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className='flex items-center justify-center h-full'>
                                <div className='text-center'>
                                    <span className='text-4xl mb-2 block'>💭</span>
                                    <p className='text-gray-500 font-medium'>No messages yet</p>
                                    <p className='text-gray-400 text-sm'>Start the conversation!</p>
                                </div>
                            </div>
                        ): (
                            messages.map((msg, idx)=>(
                                <div 
                                    key={idx} 
                                    className={`flex ${msg.sender.username === user.username ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                                        msg.sender.username === user.username
                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-bl-3xl'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-br-3xl'
                                    }`}>
                                        <p className='text-xs font-semibold opacity-75 mb-1'>{msg.sender.username}</p>
                                        <p className='text-sm'>{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* message input form  */}
                    <div className='border-t border-gray-200 bg-white px-6 py-4 shadow-lg'>
                        <form onSubmit={handleMessage} className='flex items-center space-x-3'>
                            <input 
                                type="text" 
                                value={messageText} 
                                onChange={(e)=>setMessageText(e.target.value)} 
                                placeholder='Type a message...' 
                                className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition' 
                            />
                            <button 
                                type='submit' 
                                className='px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 font-semibold transition transform hover:shadow-lg'
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-center'>
                        <span className='text-5xl mb-4 block'>👋</span>
                        <p className='text-gray-500 font-medium text-lg'>Select a conversation to start chatting</p>
                        <p className='text-gray-400 text-sm mt-2'>Or create a new chat using the + button</p>
                    </div>
                </div>
            )}
        </main>

        {/* Modal */}
        {showModal && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-2xl p-8 w-96 max-h-screen overflow-y-auto shadow-2xl'>
                    <h3 className='text-2xl font-bold mb-6 text-gray-900'>New Conversation</h3>
                    <CreateConversationModal closeModal={() => setShowModal(false)} />
                    <button 
                        onClick={() => setShowModal(false)}
                        className='mt-6 w-full px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition'
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default Chat
