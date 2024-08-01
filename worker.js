/**
 * Worker for Processing File Thumbnails
 *
 * This module uses the Bull queue system to asynchronously process jobs
 * related to file thumbnail creation. It generates thumbnails in various
 * sizes for files uploaded by users, ensuring each job is processed
 * efficiently.
 */

const Bull = require('bull'); // Import Bull for managing job queues
const imageThumbnail = require('image-thumbnail'); // For generating thumbnails
const path = require('path'); // For working with file paths
const fs = require('fs').promises; // For file system operations with promises
const { ObjectId } = require('mongodb'); // For MongoDB document IDs
const DBClient = require('./utils/db'); // For MongoDB operations

// Create a new Bull queue named 'fileQueue' for file processing jobs
const fileQueue = new Bull('fileQueue');

// Define the job processing function for the queue
fileQueue.process(async (job) => {
// Extract userId and fileId from the job data
const { userId, fileId } = job.data;

// Validate that userId and fileId are provided in the job
if (!userId) {
throw new Error('Missing userId'); // Error if userId is missing
}
if (!fileId) {
throw new Error('Missing fileId'); // Error if fileId is missing
}

// Retrieve the file document from the 'files' collection in the database
const fileDocument = await DBClient.db.collection('files').findOne({
_id: ObjectId(fileId),
userId,
});

// Check if the file document exists in the database
if (!fileDocument) {
throw new Error('File not found'); // Error if file document not found
}

// Define the sizes for the thumbnails to be generated
const sizes = [500, 250, 100];

// Construct the path to the original file using the fileId
const originalFilePath = path.join(
process.env.FOLDER_PATH || '/tmp/files_manager',
`${fileId}`
);

// Generate thumbnails for each specified size
await Promise.all(
sizes.map(async (size) => {
    try {
    // Generate a thumbnail for the current size
    const thumbnail = await imageThumbnail(originalFilePath, {
        width: size,
    });

    // Construct the path where the thumbnail will be saved
    const thumbnailFilePath = path.join(
        process.env.FOLDER_PATH || '/tmp/files_manager',
        `${fileId}_${size}`
    );

    // Write the thumbnail to the specified file path
    await fs.writeFile(thumbnailFilePath, thumbnail);

    // Log a success message (optional)
    console.log(
        `Thumbnail generated for size ${size}: ${thumbnailFilePath}`
    );
    } catch (error) {
    // Log any errors that occur during the thumbnail generation process
    console.error(
        `Error generating thumbnail for size ${size}: ${error.message}`
    );
    }
})
);
});

