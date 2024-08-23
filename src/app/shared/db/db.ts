import Dexie, { Table } from "dexie";
import { Client } from "@app/clients/models/client";

export class AppDB extends Dexie {
  clients!: Table<Client, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      clients: '++id',
    });
  }
}

export const db = new AppDB();
