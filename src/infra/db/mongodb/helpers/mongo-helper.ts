import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  async connect(url: string): Promise<void> {
    if (this.client !== undefined) {
      this.client = await MongoClient.connect(url);
    }
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }
};
