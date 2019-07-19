require('dotenv/config');

const { AuthorSeeder } = require('./author.seeder');
const { DynamoDB } = require('aws-sdk');
const { DocumentClient } = DynamoDB;
const authorsData = require('./author.data.json');

console.log(process.env);

const dynamo = new DynamoDB({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const doclient = new DocumentClient({ service: dynamo });
const authorSeeder = new AuthorSeeder(dynamo, doclient);

const log = (...mgs) => console.log('>>', ...mgs);

const seedAuthors = async () => {
    log(`Checking if 'authors' table exists`);

    const exists = await authorSeeder.hasTable();

    if (exists) {
        log(`Table 'authors' exists, deleting`);
        await authorSeeder.deleteTable();
    }

    log(`Creating 'authors' table`);
    await authorSeeder.createTable();

    log('Seeding data');
    await authorSeeder.seed(authorsData);
};

seedAuthors()
    .then(() => log('Done!'))
    .catch(err => console.log(err));
