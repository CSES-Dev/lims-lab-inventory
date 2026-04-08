import { connectToDatabase, disconnectDatabase } from '@/lib/mongoose';
import mongoose from 'mongoose';

describe('Database Connection (Singleton)', () => {
  beforeEach(async () => {
    // Reset global mongoose state
    global.mongoose = { conn: null, promise: null };
  });

  afterEach(async () => {
    await disconnectDatabase();
  });

  it('should establish a database connection', async () => {
    const connection = await connectToDatabase();

    expect(connection).toBeDefined();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  it('should return the same connection on multiple calls', async () => {
    const conn1 = await connectToDatabase();
    const conn2 = await connectToDatabase();
    const conn3 = await connectToDatabase();

    expect(conn1).toBe(conn2);
    expect(conn2).toBe(conn3);
  });

  it('should handle concurrent connection requests', async () => {
    const promises = Array(10)
      .fill(null)
      .map(() => connectToDatabase());

    const connections = await Promise.all(promises);
    const uniqueConnections = new Set(connections);

    expect(uniqueConnections.size).toBe(1);
  });

  it('should reconnect after disconnection', async () => {
    const conn1 = await connectToDatabase();
    expect(mongoose.connection.readyState).toBe(1);

    await disconnectDatabase();
    expect(mongoose.connection.readyState).toBe(0);

    const conn2 = await connectToDatabase();
    expect(mongoose.connection.readyState).toBe(1);
  });
});