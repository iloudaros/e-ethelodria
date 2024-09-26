const pool = require('../db');

const taskController = {
    
    // Method to return all the offers into the db
    completeTask: async (req, res) =>{
        const {id} = req.params;
        console.log('Completing task:', id);


        /// Remove task from the Task_list
        try {
            await pool.query('DELETE FROM Task_list WHERE task = UUID_TO_BIN(?)', [id]);
            console.log('Task removed from Task_list');
        } catch (error) {
            console.error('Error removing task from Task_list:', error);
            res.status(500).json({ message: 'Server error', error });
        }


        // Update the task state to "done"
        try {
            await pool.query('UPDATE Task SET state = "done" WHERE id = UUID_TO_BIN(?)', [id]);
            console.log('Task completed');
            res.json({ message: 'Task completed' });
        } catch (error) {
            console.error('Error completing task:', error);
            res.status(500).json({ message: 'Server error', error });
        }

        // Add today's date to the task date_out column
        try {
            await pool.query('UPDATE Task SET date_out = CURDATE() WHERE id = UUID_TO_BIN(?)', [id]);
            console.log('Task date_out updated');
        } catch (error) {
            console.error('Error updating task date_out:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    
    cancelTask: async (req, res) =>{
        const {id} = req.params;
        console.log('Cancelling task:', id);
        
        // Remove task from the Task_list
        try {
            await pool.query('DELETE FROM Task_list WHERE task = UUID_TO_BIN(?)', [id]);
            console.log('Task removed from Task_list');
        } catch (error) {
            console.error('Error removing task from Task_list:', error);
            res.status(500).json({ message: 'Server error', error });
        }
        
        // Update the state of the task
        try {
            await pool.query('UPDATE Task SET state = "pending" WHERE id = UUID_TO_BIN(?)', [id]);
            console.log('Task state updated');
            res.json({ message: 'Task cancelled' });
        } catch (error) {
            console.error('Error updating task', error);
        }
        
        
    }
}
    
    module.exports = taskController