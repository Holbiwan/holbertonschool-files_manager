/* eslint-disable */
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import Bull from 'bull';
import RedisClient from '../utils/redis';
import DBClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const fileQueue = new Bull('fileQueue');

    const token = req.header('X-Token') || null;
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.db
      .collection('users')
      .findOne({ _id: ObjectId(redisToken) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const { name, type, data, isPublic = false, parentId = 0 } = req.body;

    if (!name) return res.status(400).send({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type))
      return res.status(400).send({ error: 'Missing type' });
    if (!data && type !== 'folder')
      return res.status(400).send({ error: 'Missing data' });

    let parentFileId = parentId;
    if (parentId !== 0) {
      const parentFile = await DBClient.db
        .collection('files')
        .findOne({ _id: ObjectId(parentId) });
      if (!parentFile) return res.status(400).send({ error: 'Parent not found' });
      if (parentFile.type !== 'folder')
        return res.status(400).send({ error: 'Parent is not a folder' });
    }

    const fileData = {
      userId: user._id,
      name,
      type,
      isPublic,
      parentId: parentFileId,
    };

    if (type === 'folder') {
      const result = await DBClient.db.collection('files').insertOne(fileData);
      return res.status(201).send({
        id: result.insertedId,
        ...fileData,
      });
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileUuid = uuidv4();
    const filePath = path.join(folderPath, fileUuid);

    fs.mkdirSync(folderPath, { recursive: true });

    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, buffer);

    fileData.localPath = filePath;

    const result = await DBClient.db.collection('files').insertOne(fileData);

    fileQueue.add({
      userId: user._id,
      fileId: result.insertedId,
    });

    return res.status(201).send({
      id: result.insertedId,
      ...fileData,
    });
  }
}

export default FilesController;
