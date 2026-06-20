import { describe, test, expect, beforeEach, vi } from "vitest";
import CheckinService from "../src/services/CheckinService.js";

describe("CheckinService", () => {
  let service;
  let checkinRepo;
  let reservationRepo;

  const reservaConfirmada = {
    id: 1,
    status: "CONFIRMED",
    check_in_date: "2026-01-01",
  };

  beforeEach(() => {
    checkinRepo = {
      saveCheckin: vi.fn(),
      findByReservationId: vi.fn(),
    };
    reservationRepo = {
      findById: vi.fn(),
      updateStatus: vi.fn(),
    };
    service = new CheckinService(checkinRepo, reservationRepo);
  });

  test("retorna la reserva actualizada tras un checkin exitoso", () => {
    reservationRepo.findById.mockReturnValue(reservaConfirmada);
    reservationRepo.updateStatus.mockReturnValue({
      ...reservaConfirmada,
      status: "CHECKED_IN",
    });

    const result = service.checkin(1);

    expect(result.status).toBe("CHECKED_IN");
    expect(checkinRepo.saveCheckin).toHaveBeenCalledWith(1);
  });

  test("lanza error si la reserva no existe", () => {
    reservationRepo.findById.mockReturnValue(null);
    expect(() => service.checkin(99)).toThrow("No existe la reservacion");
  });

  test("lanza error si se intenta hacer checkin antes de la fecha programada", () => {
    reservationRepo.findById.mockReturnValue({
      ...reservaConfirmada,
      check_in_date: "2099-12-31",
    });
    expect(() => service.checkin(1)).toThrow("antes de la fecha programada");
  });
});
