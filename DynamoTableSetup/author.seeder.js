class AuthorSeeder {

    constructor(dynamodb, docClient){
        this.dynamodb = dynamodb;
        this.docClient = docClient;

        this._tableName = 'Authors';
    }

    async hasTable() {
        const tables = await this.dynamodb.listTables({ Limit: 5 }).promise();

        return tables.TableNames && tables.TableNames.indexOf(this._tableName) >= 0;
    }

    async createTable() {
        const tableParams = {
            TableName: this._tableName,
            KeySchema: [
                // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
                {
                    // Required HASH type attribute
                    AttributeName: 'id',
                    KeyType: 'HASH',
                }
            ],
            AttributeDefinitions: [
                // The names and types of all primary and index key attributes only
                {
                    AttributeName: 'id',
                    AttributeType: 'S', // (S | N | B) for string, number, binary
                }
            ],
            ProvisionedThroughput: { // required provisioned throughput for the table
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            }
        };

        const result = await this.dynamodb.createTable(tableParams).promise();

        return !!result.$response.error;
    }

    async deleteTable() {
        const result = await this.dynamodb.deleteTable({ TableName: this._tableName }).promise();

        return !!result.$response.err
    }

    /**
     * @param {AddressBook.Contact[]} author The seed data
     */
    async seed(author = []) {
        // map the contact entries to a put request object
        const putRequests = author.map(c => ({
            PutRequest: {
                Item: Object.assign({}, c)
            }
        }));

        // set the request items param with the put requests
        const params = {
            RequestItems: {
                [this._tableName]: putRequests
            }
        };

        await this.docClient.batchWrite(params).promise();
    }
}

exports.AuthorSeeder = AuthorSeeder;