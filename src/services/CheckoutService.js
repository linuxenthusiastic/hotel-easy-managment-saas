import { getReservationState } from '../models/ReservationState.js'

const LATE_CHECKOUT_HORA_LIMITE = 12;
const LATE_CHECKOUT_CARGO       = 30;

class CheckoutService {
    constructor(checkinRepository, reservationRepository){
        this.checkinRepository     = checkinRepository;
        this.reservationRepository = reservationRepository;
    }
    checkout(reservationId, notes = '') {
        const reservation = this.reservationRepository.findById(reservationId)
        if(!reservation) throw new Error("No existe reservacion con este id");

        const state = getReservationState(reservation.status);
        state.checkout();

        const checkin = this.checkinRepository.findByReservationId(reservationId)
        if(!checkin) throw new Error("No se encontro el checkin");

        const now = new Date();
        const isLate  = now.getHours() >= LATE_CHECKOUT_HORA_LIMITE
        const lateFee = isLate ? LATE_CHECKOUT_CARGO : 0

        this.checkinRepository.saveCheckout(reservationId, isLate, lateFee, notes)
        return this.reservationRepository.updateStatus(reservationId,
    }
}

export default CheckoutService;
