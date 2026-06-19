class HotelServiceService {
  constructor(HotelServiceRepository) {
    this.HotelServiceRepository = HotelServiceRepository;
  }
  getAll() {
    return this.HotelServiceRepository.findAll();
  }

  getByCategory(category) {
    if (!category) {
      throw new Error("La categoría es obligatoria");
    }
    return this.HotelServiceRepository.findByCategory(category);
  }
}

export default HotelServiceService;
