const pool = require('../db');

const statsController = {
    // Method to return all the requests into the db
    getData: async (req, res) => {
        try {
            const { start_date, end_date } = req.query;

            console.log('start_date:', start_date);
            console.log('end_date:', end_date);
            
            // Calculate the number of new requests and offers per day
            const newRequestsQuery = `SELECT 
                DATE(date_in) AS request_date,
                COUNT(*) AS new_requests
                FROM 
                    Task
                WHERE   
                    type = 'request' AND
                    date_in BETWEEN DATE(?) AND DATE(?)
                GROUP BY 
                    DATE(date_in)
                ORDER BY 
                    request_date;`;
            
            const newOffersQuery = `SELECT 
                DATE(date_in) AS offer_date,
                COUNT(*) AS new_offers
                FROM 
                    Task
                WHERE   
                    type = 'offer' AND
                    date_in BETWEEN DATE(?) AND DATE(?)
                GROUP BY 
                    DATE(date_in)
                ORDER BY 
                    offer_date;`;

            const [newRequestsResult] = await pool.query(newRequestsQuery, [start_date, end_date]);
            const [newOffersResult] = await pool.query(newOffersQuery, [start_date, end_date]);

            
            // Calculate the number of completed requests and offers per day
            const completedRequestsQuery = `SELECT 
                DATE(date_out) AS completion_date,
                COUNT(*) AS completed_requests
                FROM 
                    Task
                WHERE 
                    type = 'request' AND
                    state = 'done' AND
                    date_out BETWEEN DATE(?) AND DATE(?)
                GROUP BY 
                    DATE(date_out)
                ORDER BY 
                    completion_date;`;

            const completedOffersQuery = `SELECT 
                DATE(date_out) AS completion_date,
                COUNT(*) AS completed_offers
                FROM 
                    Task
                WHERE 
                    type = 'offer' AND
                    state = 'done' AND
                    date_out BETWEEN DATE(?) AND DATE(?)
                GROUP BY 
                    DATE(date_out)
                ORDER BY 
                    completion_date;`;

            const [completedRequestsResult] = await pool.query(completedRequestsQuery, [start_date, end_date]);
            const [completedOffersResult] = await pool.query(completedOffersQuery, [start_date, end_date]);
            
            // Create a dictionary to hold the results
            const results = {};
            
            // Populate the results dictionary
            newRequestsResult.forEach(row => {
                const date = row.request_date.toISOString().split('T')[0];
                if (!results[date]) {
                    results[date] = { date, new_requests: 0, new_offers: 0, completed_requests: 0, completed_offers: 0 };
                }
                results[date].new_requests = row.new_requests;
            });

            newOffersResult.forEach(row => {
                const date = row.offer_date.toISOString().split('T')[0];
                if (!results[date]) {
                    results[date] = { date, new_requests: 0, new_offers: 0, completed_requests: 0, completed_offers: 0 };
                }
                results[date].new_offers = row.new_offers;
            });

            completedRequestsResult.forEach(row => {
                const date = row.completion_date.toISOString().split('T')[0];
                if (!results[date]) {
                    results[date] = { date, new_requests: 0, new_offers: 0, completed_requests: 0, completed_offers: 0 };
                }
                results[date].completed_requests = row.completed_requests;
            });

            completedOffersResult.forEach(row => {
                const date = row.completion_date.toISOString().split('T')[0];
                if (!results[date]) {
                    results[date] = { date, new_requests: 0, new_offers: 0, completed_requests: 0, completed_offers: 0 };
                }
                results[date].completed_offers = row.completed_offers;
            });
            
            // Make sure that all the results have the same length, containing every date in the range
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const dateRange = [];
            const currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                if (!results[dateStr]) {
                    results[dateStr] = { date: dateStr, new_requests: 0, new_offers: 0, completed_requests: 0, completed_offers: 0 };
                }
                dateRange.push(results[dateStr]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // Convert results object to array
            const resultsArray = Object.values(results);
            
            // Return the results
            res.status(200).json(resultsArray);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    }
}

module.exports = statsController;
