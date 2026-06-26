class RoomController {
    constructor(RoomService){
        this.RoomService = RoomService;
    }
    getAll(req, res) {
        try {
            res.json(this.RoomService.getAll())
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    availableRooms(req,res){
        try{
            const {checkIn , checkOut , type} = req.query;
            if(!checkIn || !checkOut){
                return res.status(400).json({ error: 'Las fechas son obligatorias' }) 
            }
            const rooms = this.RoomService.availableRooms(checkIn,checkOut , type || null)
            res.json(rooms)
        } catch(error) {
            res.status(400).json({ error: error.message })
        }
    }

    getRoomTypes(req, res) {
        try {
            res.json(this.RoomService.getRoomTypes())
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
        }
        
        applyStrategy(req, res) {
        try {
            const { type } = req.query
            if (!type) {
            return res.status(400).json({ error: 'El tipo es obligatorio' })
            }
            res.json(this.RoomService.applyStrategy(type))
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
        }
}

export default RoomController;