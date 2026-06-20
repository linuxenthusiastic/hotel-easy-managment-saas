import { describe, test, expect } from "vitest";
import { getReservationState } from "../src/models/ReservationState.js";

describe("ReservationState", () => {
  test("lanza error para un estado inválido", () => {
    expect(() => getReservationState("INVALIDO")).toThrow("Estado no válido");
  });

  describe("CONFIRMED", () => {
    const state = getReservationState("CONFIRMED");
    test("puede hacer check-in", () => {
      expect(state.checkin()).toBe("CHECKED_IN");
    });
    test("puede cancelarse", () => {
      expect(state.cancel()).toBe("CANCELLED");
    });
    test("no puede hacer check-out", () => {
      expect(() => state.checkout()).toThrow();
    });
  });

  describe("CHECKED_IN", () => {
    const state = getReservationState("CHECKED_IN");
    test("puede hacer check-out", () => {
      expect(state.checkout()).toBe("CHECKED_OUT");
    });
    test("no puede hacer check-in nuevamente", () => {
      expect(() => state.checkin()).toThrow("ya tiene check-in");
    });
    test("no puede cancelarse con check-in activo", () => {
      expect(() => state.cancel()).toThrow("check-in activo");
    });
  });

  describe("CHECKED_OUT", () => {
    const state = getReservationState("CHECKED_OUT");
    test("no puede hacer check-in", () => {
      expect(() => state.checkin()).toThrow("ya fue completada");
    });
    test("no puede hacer check-out", () => {
      expect(() => state.checkout()).toThrow("ya fue completada");
    });
    test("no puede cancelarse", () => {
      expect(() => state.cancel()).toThrow("ya fue completada");
    });
  });

  describe("CANCELLED", () => {
    const state = getReservationState("CANCELLED");
    test("no puede hacer check-in", () => {
      expect(() => state.checkin()).toThrow("cancelada");
    });
    test("no puede hacer check-out", () => {
      expect(() => state.checkout()).toThrow("cancelada");
    });
    test("no puede cancelarse de nuevo", () => {
      expect(() => state.cancel()).toThrow("ya está cancelada");
    });
  });
});
