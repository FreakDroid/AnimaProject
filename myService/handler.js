require('dotenv/config');

const { AuthorRepository } = require('./author.repository');
const { withProcessEnv } = require('./dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new AuthorRepository(docClient);


module.exports.hello = async event => {
    console.log(JSON.stringify(event.pathParameters));
    const { id } = event.pathParameters;
    console.log(id);
    const author = await repository.get(id);

    if (!author){
        ///return notFound();
    }

    return author;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
