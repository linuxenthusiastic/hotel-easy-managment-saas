import { getRoomStrategy } from "../models/RoomStrategy.js";

class RoomService {
  constructor(roomRepository, roomTypeRepository) {
    this.roomRepository = roomRepository;
    this.roomTypeRepository = roomTypeRepository;
  }

  getAll() {
    return this.roomRepository.findAll();
  }

  getRoomTypes() {
    return this.roomTypeRepository.findAll();
  }

  applyStrategy(type) {
    const roomType = this.roomTypeRepository.findByType(type);
    if (!roomType) throw new Error(`Tipo no valido: ${type}`);
    const strategy = getRoomStrategy(roomType);
    return strategy.toJSON();
  }

  availableRooms(checkIn, checkOut, type = null) {
    this._validateDateRange(checkIn, checkOut);
    if (type) {
      const roomType = this.roomTypeRepository.findByType(type);
      if (!roomType) throw new Error(`Tipo no valido: ${type}`);
      getRoomStrategy(roomType).validate();
    }
    const rooms = this.roomRepository.findAvailable(checkIn, checkOut, type);
    if (!rooms || rooms.length === 0)
      throw new Error("No hay habitaciones disponibles en esas fechas");
    return rooms;
  }

  _validateDateRange(checkIn, checkOut) {
    if (checkIn >= checkOut)
      throw new Error("Check-in debe ser anterior a check-out");
  }
}

export default RoomService;
