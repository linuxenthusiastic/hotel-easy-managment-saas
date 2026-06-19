import { describe, test, expect, beforeEach, vi } from "vitest";
import GuestService from "../src/services/GuestService.js";

describe("GuestService", () => {
  let service;
  let repo;

  beforeEach(() => {
    repo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByDocument: vi.fn(),
      save: vi.fn(),
    };
    service = new GuestService(repo);
  });

  describe("findAll", () => {
    test("retorna todos los huéspedes", () => {
      const huespedes = [{ id: 1 }, { id: 2 }];
      repo.findAll.mockReturnValue(huespedes);
      expect(service.findAll()).toEqual(huespedes);
    });

    test("retorna lista vacía cuando no hay huéspedes", () => {
      repo.findAll.mockReturnValue([]);
      const resultado = service.findAll();
      expect(resultado).toEqual([]);
      expect(Array.isArray(resultado)).toBe(true);
    });
  });

  describe("findById", () => {
    test("retorna el huésped si existe", () => {
      const huesped = { id: 1, full_name: "Ana López" };
      repo.findById.mockReturnValue(huesped);
      expect(service.findById(1)).toEqual(huesped);
    });

    test("lanza error si no existe", () => {
      repo.findById.mockReturnValue(null);
      expect(() => service.findById(99)).toThrow("no ha sido encontrado");
    });
  });

  describe("findByDocument", () => {
    test("retorna el huésped si el documento existe", () => {
      const huesped = { id: 1, document_number: "30000001" };
      repo.findByDocument.mockReturnValue(huesped);
      expect(service.findByDocument("30000001")).toEqual(huesped);
    });

    test("lanza error si el documento no existe", () => {
      repo.findByDocument.mockReturnValue(null);
      expect(() => service.findByDocument("00000000")).toThrow(
        "no ha sido encontrado",
      );
    });
  });

  describe("create", () => {
    test("crea y guarda un huésped válido", () => {
      const data = {
        full_name: "Carlos Ruiz",
        document_number: "30000002",
        email: "c@mail.com",
        phone: "1122334455",
      };
      const guardado = { id: 1, ...data };
      repo.findByDocument.mockReturnValue(null);
      repo.save.mockReturnValue(guardado);
      expect(service.create(data)).toEqual(guardado);
    });

    test("lanza error si el documento ya está registrado", () => {
      repo.findByDocument.mockReturnValue({ id: 1 });
      expect(() =>
        service.create({ full_name: "Carlos", document_number: "30000002" }),
      ).toThrow("Ya existe un huésped");
    });

    test("lanza error si falta el nombre", () => {
      repo.findByDocument.mockReturnValue(null);
      expect(() =>
        service.create({ full_name: "", document_number: "30000003" }),
      ).toThrow("nombre es obligatorio");
    });

    test("lanza error si falta el documento", () => {
      repo.findByDocument.mockReturnValue(null);
      expect(() =>
        service.create({ full_name: "Luis Vera", document_number: "" }),
      ).toThrow("documento es obligatorio");
    });
  });
});
