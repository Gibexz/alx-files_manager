const { ObjectID } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const FilesController = {
    async postUpload(req, res) {
        const token = req.headers['X-Token'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;

        const userIdFromRedis = await redisClient.get(key);

        const userIdforMongo = new ObjectID(userIdFromRedis);

        const user = await dbClient.client.db().collection('users').findOne({_id: userIdforMongo});

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const { name, type, parentId = 0, isPublic = false, data } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Missing name' });
        }
        // if (!type || !['folder', 'image', 'file'].includes(type))
        if (!type || (type !== 'folder' && type !== 'image' && type !== 'file')) {
            res.status(400).json({ error:'Missing type' });
        }
        if (!data && (type !== "folder")) {
            res.status(400).json({ error:'Missing data' });

        }



    },
}

module.exports = FilesController;