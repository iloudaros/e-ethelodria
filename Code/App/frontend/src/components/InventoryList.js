import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryList = ( id ) => {
    const [inventory, setInventory] = useState([]);
    
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                console.log(`Fetching inventory of vehicle with id: ${id.id}`);
                const response = await axios.get(`http://localhost:3000/api/inventory/single/${id.id}`);
                console.log(`Inventory fetched: ${response.data.length}`);
                console.log(response.data);
                setInventory(response.data);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };
        
        fetchInventory();
    }, [id]);
    
    // Returns a nice table with the inventory data
    return (
        <>
        {inventory.length >0?
        <table style={{border: '1px solid grey', borderCollapse: 'collapse', width: '100%'}}>
        <thead>
        <tr>
        <th>Product</th>
        <th>Quantity</th>
        </tr>
        </thead>
        <tbody>
        {inventory.map((item) => (
            <tr key={item.product}>
            <td>{item.product}</td>
            <td>{item.quantity}</td>
            </tr>
        ))}
        </tbody>
        </table>
        :<p>Inventory is empty</p>}
        </>
    );
    
    
};

export default InventoryList;