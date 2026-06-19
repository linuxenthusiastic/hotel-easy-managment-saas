import GuestFactory from "../models/GuestFactory.js";

class GuestService {
  constructor(GuestRepository) {
    this.GuestRepository = GuestRepository;
  }
  findAll() {
    return this.GuestRepository.findAll();
  }

  findById(id) {
    const guest = this.GuestRepository.findById(id);

    if (!guest) {
      throw new Error(`Huesped con id: ${id} no ha sido encontrado`);
    }

    return guest;
  }

  findByDocument(document) {
    const guest = this.GuestRepository.findByDocument(document);

    if (!guest) {
      throw new Error(
        `El huesped con documento ${document} no ha sido encontrado`,
      );
    }

    return guest;
  }

  create(data) {
    const guest = GuestFactory.create(data);

    if (this.GuestRepository.findByDocument(guest.document_number)) {
      throw new Error(
        `Ya existe un huésped con el documento ${guest.document_number}`,
      );
    }

    return this.GuestRepository.save(guest);
  }
}

export default GuestService;
