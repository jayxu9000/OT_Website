import React, { useState, useEffect } from 'react';

function AdminList() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchNonAdminUsers = async () => {
            try {
                const response = await fetch(`${apiUrl}/users/nonAdminUsers`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchNonAdminUsers();
    }, [apiUrl]);

    const handleAdminPromotion = async () => {
        if (!selectedUserId) {
            alert("Please select a user to promote.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/users/promoteToAdmin/${selectedUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                window.location.reload(); // Reload the page to update the list
            } else {
                console.error('Failed to promote user:', response.statusText);
            }
        } catch (error) {
            console.log('Error promoting user:', error);
        }
    };

    return (
        <div className='adminList'>
            <h4>Promote a member to eboard:</h4>
            <div>
                <select 
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName} - Line Number: {user.lineNumber}
                        </option>
                    ))}
                </select>
                <button onClick={handleAdminPromotion}>
                    Approve
                </button>
            </div>
        </div>
    );
}

export default AdminList;
