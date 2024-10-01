const pool = require('../db');
const { get } = require('../routes/vehicleRoutes');

const vehicleController = {
    
    // This method returns all the vehicles that are in the database
    getVehicles: async (req, res) => {
        try {
            console.log('Fetching vehicles...');
            const [rows] = await pool.query('SELECT hex(id) as id, username, hex(owner) as owner, latitude, longitude, state FROM Vehicle');
            console.log('Vehicles fetched:', rows.length);
            console.log(rows);
            
            // For every vehicle, get the tasks that are assigned to it from the Task_List table
            var vehiclesWithTasks = await Promise.all(rows.map(async (vehicle) => {
                var [taskIds] = await pool.query('SELECT task FROM Task_List WHERE id = UUID_TO_BIN(?)', [vehicle.id]);
                var tasks = await Promise.all(taskIds.map(async (taskId) => {
                    var [task] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task WHERE id = ?', [taskId.task]);
                    return task;
                }));
                console.log('Tasks fetched for vehicle', vehicle.id, ':', tasks.length);
                console.log(tasks);
                
                // Add the location of the user who created the task
                tasks = await Promise.all(tasks.map(async (task) => {
                    console.log('Fetching user location for task', task);
                    var [user] = await pool.query('SELECT latitude, longitude FROM User WHERE id = UUID_TO_BIN(?)', [task[0].user]);
                    console.log(user);
                    return {
                        ...task,
                        userLocation: {
                            latitude: user[0].latitude,
                            longitude: user[0].longitude
                        }
                    }
                }));
                console.log(tasks);
                
                return {
                    ...vehicle,
                    tasks: tasks
                }
            }
        ));
        
        console.log(vehiclesWithTasks);
        console.log(vehiclesWithTasks.tasks);
        
        res.json(vehiclesWithTasks);}
        catch (error) {
            console.error('Error fetching vehicles:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    
    
    // This method returns a single vehicle that is in the database, along with its inventory
    getSingleVehicle: async (req, res) => {
        try {
            const { owner } = req.params;
            const [rows] = await pool.query('SELECT hex(id) as id, username, hex(owner) as owner, latitude, longitude, state FROM Vehicle WHERE owner = UUID_TO_BIN(?)', [owner]);
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
    
            const [product_list] = await pool.query('SELECT hex(id) as id, product, quantity FROM Product_List WHERE id = UUID_TO_BIN(?)', [rows[0].id]);
            
            // for every product in the inventory, get the product name and the quantity from the Product table
            const inventory = await Promise.all(product_list.map(async (product) => {
                const [product_name] = await pool.query('SELECT hex(id) as id, name FROM Product WHERE id = ?', [product.product]);
                if (product_name.length === 0) {
                    return null;
                }
                return {
                    id: product_name[0].id,
                    name: product_name[0].name,
                    quantity: product.quantity
                };
            }));
    
            // Filter out any null products (in case a product was not found in the Product table)
            const filteredInventory = inventory.filter(product => product !== null);
    
            const [taskids] = await pool.query('SELECT task FROM Task_List WHERE id = UUID_TO_BIN(?)', [rows[0].id]);
            const [tasks] = await pool.query('SELECT hex(id) as id, hex(user_id) as user, date_in, accepted_in, date_out, state, type FROM Task WHERE id = ?', [taskids[0].task]);
            
            // create a new object with the above data
            const vehicle = {
                ...rows[0],
                inventory: filteredInventory,
                tasks: tasks
            };
            res.json(vehicle);
        } catch (error) {
            console.error('Error fetching vehicle:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    updateLocation: async (req, res) =>{
        const {id, latitude, longitude} = req.body;
        console.log('Received location update request for:', id);
        try {
            await pool.query('UPDATE Vehicle SET latitude = ?, longitude = ? WHERE id = UUID_TO_BIN(?)', [latitude, longitude, id]);
            console.log('Location updated');
            res.json({ message: 'Location updated' });
        } catch (error) {
            console.error('Server error:', error);
        }
    }
}
    

module.exports = vehicleController;
