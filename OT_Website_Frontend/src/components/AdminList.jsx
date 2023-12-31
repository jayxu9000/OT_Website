import React, { useState, useEffect } from 'react';

function AdminList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Function to fetch non-admin users
        const fetchNonAdminUsers = async () => {
            try {
                const response = await fetch('https://ec2-18-117-157-65.us-east-2.compute.amazonaws.com/users/nonAdminUsers/'); // Adjust the URL as needed
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    // Handle any errors that occurred during the fetch
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchNonAdminUsers();
    }, []);

    const handleAdminPromotion = async (userId) => {
        console.log(`Button for user ${userId} was clicked`);
        try {
            const response = await fetch(`https://ec2-18-117-157-65.us-east-2.compute.amazonaws.com/users/promoteToAdmin/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const result = await response.json();
                window.location.reload();
                alert(result.message)
            } else {
                console.error('Failed to promote user:', response.statusText)
            }
        } catch (error) {
            console.log('Error promoting user:', error)
        }
    };

    return (
        <div className='adminList'>
            <h4>Promote a member to eboard:</h4>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Line Number</th>
                        <th>Promote to Eboard:</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.lineNumber}</td>
                            <td>
                                <button onClick={() => handleAdminPromotion(user._id)}>
                                    Approve
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminList;