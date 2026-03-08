import { mockServer } from './mockServer';
import { randomDelay } from '../../lib/utils';

export const appointmentsApi = {
  async getAll() {
    await randomDelay();
    return mockServer.getAppointments();
  },

  async getByPatient(patientId) {
    await randomDelay();
    return mockServer.getAppointmentsByPatient(patientId);
  },

  async create(data) {
    await randomDelay();
    return mockServer.addAppointment(data);
  },

  async update(id, data) {
    await randomDelay();
    return mockServer.updateAppointment(id, data);
  },

  async getWaitingRoom() {
    await randomDelay();
    return mockServer.getWaitingRoom();
  },

  async getWaitingRoomByPatient(patientId) {
    await randomDelay();
    return mockServer.getWaitingRoomByPatient(patientId);
  },

  async updateWaitingRoomStatus(id, status) {
    await randomDelay();
    return mockServer.updateWaitingRoomStatus(id, status);
  },

  async checkIn(patientId, patientName, appointmentTime) {
    await randomDelay();
    return mockServer.checkIn(patientId, patientName, appointmentTime);
  },

  async checkOut(id) {
    await randomDelay();
    return mockServer.checkOut(id);
  },
};
