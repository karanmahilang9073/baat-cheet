import { useState,createContext, useContext, useEffect, useRef } from "react";
import {useAuth} from './authContext'
import socket from "../utils/socket";
import api from "../utils/api";



const ChatContext = createContext()

export const ChatProvider = ({children}) =>{
    const { user } = useAuth()

    //states
    const [conversations, setConversations] = useState([])
    const [currentConversation, setCurrentConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const currentConversationref = useRef(currentConversation)

    //sync ref with state
    useEffect(() =>{
        currentConversationref.current = currentConversation;
    },[currentConversation])

    useEffect(()=>{

        if(!socket.connected) socket.connect()

        const handleMessage = (newMessage) => {
            // If the message belongs to the currently open chat, append it
            if(currentConversationref.current && newMessage.conversationId === currentConversationref.current._id) {
                setMessages((prev) => [...prev, newMessage])
            }  
            //always update the sidebar (move chat to top + update preview)
            setConversations((prev) => {
                const updateConversations = prev.map(conv =>{
                    if(conv._id === newMessage.conversationId){
                        return {
                            ...conv,
                            latestMessage : newMessage, //update preview text
                            updatedAt : new Date().toISOString()
                        }
                    }
                    return conv;
                })
                //newest first
                return updateConversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            })
        }
        socket.on('new-message',handleMessage)

        return () =>{
                socket.off('new-message',handleMessage)
        }
    },[])

    const getUserConversations = async ()=>{
        if(!user) return;
        setLoading(true)
        setError(null)

        try {
            const {data} = await api.get('/chat')
            setConversations(data)
        } catch (error) {
            console.error('conversation error', error)
            setError(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(user) {
            getUserConversations()
        }
    },[user])

    const createConversation = async({name, members, isGroup}) =>{
        setLoading(true)
        setError(null)

        try {
            const {data} = await api.post('/chat/create-chat',{
                name,
                members,
                isGroup
            })
            //optimisticalyy add to top of list
            setConversations((prev)=>[data,...prev])
            return data
        } catch (error) {
            console.error('create conversation error',error);
            setError(error.response?.data?.message || error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = ({conversationId, text, sender})=>{
        if(!conversationId || !text)  return;
        //emit to server
        socket.emit('send-message',{
            conversationId, text, sender
        })
    }

    const selectConversation = async (conversation) =>{
        if(currentConversation?._id){
            socket.emit('leave-conversation', currentConversation._id)
        }
        setCurrentConversation(conversation)
        
        if(conversation?._id){
            try {
                //fetch history
                const {data} = await api.get(`/message/${conversation._id}`)
                setMessages(data)
                //join new room
                socket.emit('join-conversation', conversation._id)
            } catch (error) {
                console.log('error loading messages',error)
                setError(error.response?.data?.message || error.message)
            }
        } else {
            setMessages([])
        }
    }

    //context values
    const value = {
        conversations,
        currentConversation,
        messages,
        loading,
        error,
        setCurrentConversation,
        setMessages,
        sendMessage,
        selectConversation,
        getUserConversations,
        createConversation
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

//export usechat hook
export const useChat = ()=>{
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('usechat must be used within a chatprovider')
    }
    return context
}