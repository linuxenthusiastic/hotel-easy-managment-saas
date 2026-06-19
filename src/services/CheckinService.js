import { getReservationState } from "../models/ReservationState.js";

class CheckinService {
  constructor(CheckinRepository, ReservationRepository) {
    this.CheckinRepository = CheckinRepository;
    this.ReservationRepository = ReservationRepository;
  }
  checkin(reservationId) {
    const reservation = this.ReservationRepository.findById(reservationId);
    if (!reservation) throw new Error("No existe la reservacion");

    const state = getReservationState(reservation.status);
    state.checkin();

    this.CheckinRepository.saveCheckin(reservationId);
    return this.ReservationRepository.updateStatus(reservationId, "CHECKED_IN");
  }
}

export default CheckinService;
