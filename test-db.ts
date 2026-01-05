import mysql from 'mysql2/promise';

async function testConnection() {
    try {
        console.log('Attempting to connect to MySQL...');
        const connection = await mysql.createConnection({
            host: '::1',
            user: 'root',
            password: '',
            port: 3306
        });
        console.log('Successfully connected to MySQL!');
        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
