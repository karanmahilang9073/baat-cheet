import { useState, useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import api from '../utils/api' // We need this to fetch users

const CreateConversationModal = ({ closeModal }) => {
    const { createConversation, loading } = useChat()

    const [name, setName] = useState('')
    const [isGroup, setIsGroup] = useState(false)
    const [availableUsers, setAvailableUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [error, setError] = useState(null)

    // 1. Fetch users when modal opens
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/chat/users');
                setAvailableUsers(data);
            } catch (err) {
                setError("Failed to load users", err);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        } else {
            // If not group, only allow 1 selection
            if (!isGroup) {
                setSelectedUsers([userId]);
            } else {
                setSelectedUsers(prev => [...prev, userId]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isGroup && !name.trim()) return setError("Group name is required");
        if (selectedUsers.length === 0) return setError("Select at least one user");

        try {
            await createConversation({
                name: isGroup ? name : undefined,
                members: selectedUsers, // This is now an array of REAL IDs
                isGroup
            });
            closeModal(); // Close modal on success
        } catch (error) {
            setError(error.message || 'Failed to create conversation');
        }
    }

    return (
        <div className='w-full'>
            <form onSubmit={handleSubmit} className='space-y-5'>
                {/* Checkbox for Group Chat */}
                <div className='flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200'>
                    <input 
                        type="checkbox" 
                        checked={isGroup} 
                        onChange={(e) => {
                            setIsGroup(e.target.checked);
                            setSelectedUsers([]);
                        }} 
                        className='h-5 w-5 text-blue-600 rounded cursor-pointer' 
                    />
                    <label className='text-sm font-semibold text-gray-700 cursor-pointer'>Create Group Chat</label>
                </div>

                {/* Group Name (Only if Group is checked) */}
                {isGroup && (
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Group Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder='e.g. Project Team' 
                            className='w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition' 
                        />
                    </div>
                )}

                {/* User List Selection */}
                <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        {isGroup ? 'Add Members' : 'Select a User'}
                    </label>
                    <div className='max-h-56 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-white space-y-2'>
                        {availableUsers.length === 0 ? (
                            <p className='text-sm text-gray-500 text-center py-4'>No users found</p>
                        ) : (
                            availableUsers.map(user => (
                                <div 
                                    key={user._id} 
                                    onClick={() => handleToggleUser(user._id)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition transform hover:scale-102 ${
                                        selectedUsers.includes(user._id) 
                                            ? 'bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-500' 
                                            : 'hover:bg-gray-50 border-2 border-transparent'
                                    }`}
                                >
                                    <div className={`shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition mr-3 ${
                                        selectedUsers.includes(user._id) 
                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 border-blue-600' 
                                            : 'border-gray-300'
                                    }`}>
                                        {selectedUsers.includes(user._id) && <span className='text-white text-xs font-bold'>✓</span>}
                                    </div>
                                    <div className='flex items-center space-x-2 flex-1'>
                                        <img src={user.avatar} alt={user.username} className='w-7 h-7 rounded-full' />
                                        <span className='text-sm font-semibold text-gray-800'>{user.username}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {error && (
                    <div className='bg-red-50 border-2 border-red-300 rounded-lg p-3'>
                        <p className='text-red-700 text-sm font-medium'>{error}</p>
                    </div>
                )}

                <button 
                    type='submit' 
                    disabled={loading} 
                    className='w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? "Creating..." : "Create Chat"}
                </button>
            </form>
        </div>
    )
}

export default CreateConversationModal