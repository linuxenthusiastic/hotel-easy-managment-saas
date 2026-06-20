class HotelServiceService {
  constructor(hotelServiceRepository) {
    this.hotelServiceRepository = hotelServiceRepository;
  }

  getAll() {
    return this.hotelServiceRepository.findAll();
  }

  getByCategory(category) {
    if (!category) throw new Error("La categoría es obligatoria");
    const result = this.hotelServiceRepository.findByCategory(category);
    this._assertNotEmpty(result, category);
    return result;
  }

  _assertNotEmpty(result, category) {
    if (!result || result.length === 0)
      throw new Error(`No hay servicios en la categoría: ${category}`);
  }
}

export default HotelServiceService;
