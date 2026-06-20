import { describe, test, expect, beforeEach, vi } from "vitest";
import RoomService from "../src/services/RoomService.js";

describe("RoomService", () => {
  let service;
  let roomRepo;
  let roomTypeRepo;

  const tipoHabitacion = {
    id: 1,
    type: "SIMPLE",
    capacity: 1,
    description: "Simple",
    base_price: 50,
  };
  const habitacion = { id: 1, type: "SIMPLE", active: true };

  beforeEach(() => {
    roomRepo = {
      findAll: vi.fn(),
      findAvailable: vi.fn(),
    };
    roomTypeRepo = {
      findAll: vi.fn(),
      findByType: vi.fn(),
    };
    service = new RoomService(roomRepo, roomTypeRepo);
  });

  describe("availableRooms", () => {
    test("retorna habitaciones disponibles en el rango dado", () => {
      roomRepo.findAvailable.mockReturnValue([habitacion]);
      expect(service.availableRooms("2026-07-01", "2026-07-03")).toEqual([
        habitacion,
      ]);
    });

    test("lanza error cuando no hay habitaciones disponibles", () => {
      roomRepo.findAvailable.mockReturnValue([]);
      expect(() =>
        service.availableRooms("2026-07-01", "2026-07-03")
      ).toThrow("No hay habitaciones disponibles");
    });

    test("lanza error si check-in es igual o posterior a check-out", () => {
      expect(() =>
        service.availableRooms("2026-07-03", "2026-07-01")
      ).toThrow("Check-in debe ser anterior a check-out");
    });
  });

  describe("applyStrategy", () => {
    test("retorna la estrategia del tipo de habitación", () => {
      roomTypeRepo.findByType.mockReturnValue(tipoHabitacion);
      const result = service.applyStrategy("SIMPLE");
      expect(result.type).toBe("SIMPLE");
      expect(result.basePrice).toBe(50);
    });

    test("lanza error si el tipo no existe", () => {
      roomTypeRepo.findByType.mockReturnValue(null);
      expect(() => service.applyStrategy("INVALIDO")).toThrow("Tipo no valido");
    });
  });
});
