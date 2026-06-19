import { describe, test, expect, beforeEach, vi } from "vitest";
import ReservationService from "../src/services/ReservationService.js";

describe("ReservationService", () => {
  let service;
  let reservationRepo;
  let roomRepo;
  let guestRepo;

  const habitacion = { id: 1, price_per_night: 100, active: true };
  const huesped = { id: 1, full_name: "Ana López" };
  const reserva = {
    id: 1,
    guest_id: 1,
    room_id: 1,
    check_in_date: "2026-07-01",
    check_out_date: "2026-07-03",
    status: "CONFIRMED",
    total_amount: 200,
  };

  beforeEach(() => {
    reservationRepo = {
      findAll: vi.fn(),
      findActive: vi.fn(),
      findById: vi.fn(),
      findByGuestId: vi.fn(),
      save: vi.fn(),
      updateStatus: vi.fn(),
    };
    roomRepo = {
      findById: vi.fn(),
      findAvailable: vi.fn(),
    };
    guestRepo = {
      findById: vi.fn(),
    };
    service = new ReservationService(reservationRepo, roomRepo, guestRepo);
  });

  describe("getById", () => {
    test("retorna la reserva si existe", () => {
      reservationRepo.findById.mockReturnValue(reserva);
      expect(service.getById(1)).toEqual(reserva);
    });

    test("lanza error si no existe", () => {
      reservationRepo.findById.mockReturnValue(null);
      expect(() => service.getById(99)).toThrow("no encontrada");
    });
  });

  describe("create", () => {
    beforeEach(() => {
      guestRepo.findById.mockReturnValue(huesped);
      roomRepo.findById.mockReturnValue(habitacion);
      roomRepo.findAvailable.mockReturnValue([habitacion]);
    });

    test("crea una reserva con total calculado correctamente", () => {
      const data = {
        guest_id: 1,
        room_id: 1,
        check_in_date: "2026-07-01",
        check_out_date: "2026-07-03",
      };
      reservationRepo.save.mockReturnValue({
        ...data,
        id: 1,
        total_amount: 200,
      });
      const resultado = service.create(data);
      expect(resultado.total_amount).toBe(200);
    });

    test("lanza error si el huésped no existe", () => {
      guestRepo.findById.mockReturnValue(null);
      expect(() =>
        service.create({
          guest_id: 99,
          room_id: 1,
          check_in_date: "2026-07-01",
          check_out_date: "2026-07-03",
        }),
      ).toThrow("huésped no existe");
    });

    test("lanza error si la habitación no existe", () => {
      roomRepo.findById.mockReturnValue(null);
      expect(() =>
        service.create({
          guest_id: 1,
          room_id: 99,
          check_in_date: "2026-07-01",
          check_out_date: "2026-07-03",
        }),
      ).toThrow("habitación no existe");
    });

    test("lanza error si check-in es igual a check-out", () => {
      expect(() =>
        service.create({
          guest_id: 1,
          room_id: 1,
          check_in_date: "2026-07-01",
          check_out_date: "2026-07-01",
        }),
      ).toThrow("posterior");
    });

    test("lanza error si la habitación no está disponible", () => {
      roomRepo.findAvailable.mockReturnValue([]);
      expect(() =>
        service.create({
          guest_id: 1,
          room_id: 1,
          check_in_date: "2026-07-01",
          check_out_date: "2026-07-03",
        }),
      ).toThrow("no está disponible");
    });
  });

  describe("cancel", () => {
    test("cancela una reserva confirmada y aplica mora del 10%", () => {
      reservationRepo.findById.mockReturnValue(reserva);
      reservationRepo.updateStatus.mockReturnValue({
        ...reserva,
        status: "CANCELLED",
      });
      service.cancel(1);
      expect(reservationRepo.updateStatus).toHaveBeenCalledWith(
        1,
        "CANCELLED",
        20,
      );
    });

    test("lanza error al cancelar una reserva ya cancelada", () => {
      reservationRepo.findById.mockReturnValue({
        ...reserva,
        status: "CANCELLED",
      });
      expect(() => service.cancel(1)).toThrow("ya está cancelada");
    });

    test("lanza error al cancelar con check-in activo", () => {
      reservationRepo.findById.mockReturnValue({
        ...reserva,
        status: "CHECKED_IN",
      });
      expect(() => service.cancel(1)).toThrow("check-in activo");
    });
  });

  describe("findByGuestId", () => {
    test("retorna las reservas del huésped", () => {
      reservationRepo.findByGuestId.mockReturnValue([reserva]);
      expect(service.findByGuestId(1)).toEqual([reserva]);
    });

    test("lanza error si el huésped no tiene reservas", () => {
      reservationRepo.findByGuestId.mockReturnValue([]);
      expect(() => service.findByGuestId(1)).toThrow("no encontrada");
    });
  });
});
