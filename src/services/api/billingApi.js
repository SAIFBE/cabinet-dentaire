import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const billingApi = {
  async getAll() {
    await randomDelay();
    return mockServer.getInvoices();
  },

  async getById(id) {
    await randomDelay();
    return mockServer.getInvoiceById(id);
  },

  async getByPatient(patientId) {
    await randomDelay();
    return mockServer.getInvoicesByPatient(patientId);
  },

  async create(data) {
    await randomDelay();
    return mockServer.addInvoice(data);
  },

  async update(id, data) {
    await randomDelay();
    return mockServer.updateInvoice(id, data);
  },

  async addPayment(id, paymentData) {
    await randomDelay();
    return mockServer.addPaymentToInvoice(id, paymentData);
  },
};
