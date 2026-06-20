import { describe, test, expect, beforeEach, vi } from "vitest";
import HotelServiceService from "../src/services/HotelServiceService.js";

describe("HotelServiceService", () => {
  let service;
  let repo;

  beforeEach(() => {
    repo = {
      findAll: vi.fn(),
      findByCategory: vi.fn(),
    };
    service = new HotelServiceService(repo);
  });

  describe("getAll", () => {
    test("retorna todos los servicios del hotel", () => {
      const servicios = [{ id: 1, name: "Spa" }];
      repo.findAll.mockReturnValue(servicios);
      expect(service.getAll()).toEqual(servicios);
    });
  });

  describe("getByCategory", () => {
    test("retorna los servicios de la categoría solicitada", () => {
      const servicios = [{ id: 1, name: "Spa", category: "wellness" }];
      repo.findByCategory.mockReturnValue(servicios);
      expect(service.getByCategory("wellness")).toEqual(servicios);
    });

    test("lanza error si la categoría es vacía", () => {
      expect(() => service.getByCategory("")).toThrow(
        "La categoría es obligatoria"
      );
    });

    test("lanza error si no hay servicios en esa categoría", () => {
      repo.findByCategory.mockReturnValue([]);
      expect(() => service.getByCategory("spa")).toThrow(
        "No hay servicios en la categoría"
      );
    });
  });
});
