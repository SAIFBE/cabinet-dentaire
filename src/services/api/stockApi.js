import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const stockApi = {
  async getAll() {
    await randomDelay();
    return mockServer.getStockItems();
  },

  async create(data) {
    await randomDelay();
    return mockServer.addStockItem(data);
  },

  async update(id, data) {
    await randomDelay();
    return mockServer.updateStockItem(id, data);
  },

  async consumeProduct(productId, data) {
    await randomDelay();
    return mockServer.consumeStockItem(productId, data);
  },

  async restockProduct(productId, data) {
    await randomDelay();
    return mockServer.restockStockItem(productId, data);
  },

  async getMovements(productId) {
    await randomDelay();
    return mockServer.getStockMovements(productId);
  },
};
