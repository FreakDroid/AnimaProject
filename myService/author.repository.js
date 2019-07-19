class AuthorRepository {
    get _baseParams() {
        return {
            TableName: 'authors'
        };
    }

    /**
     * Contructs a new contact repository
     * @param {AWS.DynamoDB.DocumentClient} documentClient The Document Client
     */
    constructor(documentClient) {
        this._documentClient = documentClient;
    }

    async get(id) {
        const params = this._createParamObject({ Key: { id } });
        const response = await this._documentClient.get(params).promise();

        return response.Item;
    }

    _createParamObject(additionalArgs = {}) {
        return Object.assign({}, this._baseParams, additionalArgs);
    }
}

exports.AuthorRepository = AuthorRepository;