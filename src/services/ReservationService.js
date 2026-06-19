import { getReservationState } from "../models/ReservationState.js";

const MORA_PORCENTAJE = 0.1;

class ReservationService {
  constructor(ReservationRepository, RoomRepository, GuestRepository) {
    this.ReservationRepository = ReservationRepository;
    this.RoomRepository = RoomRepository;
    this.GuestRepository = GuestRepository;
  }
  getAll() {
    return this.ReservationRepository.findAll();
  }
  getActive() {
    return this.ReservationRepository.findActive();
  }

  getById(id) {
    const reservation = this.ReservationRepository.findById(id);
    if (!reservation) {
      throw new Error(`Reserva con id ${id} no encontrada`);
    }
    return reservation;
  }

  create(data) {
    const guest = this.GuestRepository.findById(data.guest_id);
    if (!guest) {
      throw new Error("El huésped no existe");
    }

    const room = this.RoomRepository.findById(data.room_id);
    if (!room) {
      throw new Error("La habitación no existe o no está activa");
    }

    if (data.check_in_date >= data.check_out_date) {
      throw new Error(
        "La fecha de salida debe ser posterior a la fecha de entrada",
      );
    }

    const available = this.RoomRepository.findAvailable(
      data.check_in_date,
      data.check_out_date,
    );
    const isAvailable = available.some((r) => r.id === data.room_id);
    if (!isAvailable) {
      throw new Error("La habitación no está disponible en esas fechas");
    }

    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total = nights * room.price_per_night;

    return this.ReservationRepository.save({
      ...data,
      total_amount: total,
    });
  }

  cancel(id) {
    const reservation = this.getById(id);

    const state = getReservationState(reservation.status);
    state.cancel();

    const penalty = reservation.total_amount * MORA_PORCENTAJE;

    return this.ReservationRepository.updateStatus(id, "CANCELLED", penalty);
  }

  findByGuestId(guestId) {
    const reservation = this.ReservationRepository.findByGuestId(guestId);
    if (!reservation || reservation.length === 0) {
      throw new Error(`Reserva relacionada a ${guestId} no encontrada`);
    }
    return reservation;
  }
}

export default ReservationService;
