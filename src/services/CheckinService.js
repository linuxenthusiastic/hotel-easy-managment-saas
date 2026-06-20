import { getReservationState } from "../models/ReservationState.js";

class CheckinService {
  constructor(checkinRepository, reservationRepository) {
    this.checkinRepository = checkinRepository;
    this.reservationRepository = reservationRepository;
  }

  checkin(reservationId) {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) throw new Error("No existe la reservacion");

    this._validateCheckinDate(reservation.check_in_date);

    const state = getReservationState(reservation.status);
    state.checkin();

    this.checkinRepository.saveCheckin(reservationId);
    return this.reservationRepository.updateStatus(reservationId, "CHECKED_IN");
  }

  _validateCheckinDate(checkInDate) {
    const today = new Date().toISOString().split("T")[0];
    if (checkInDate > today)
      throw new Error(
        `No se puede hacer checkin antes de la fecha programada: ${checkInDate}`
      );
  }
}

export default CheckinService;
