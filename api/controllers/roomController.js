import Room from '../models/Room.js'
import Hotel from '../models/Hotel.js'
import createError from '../utils/error.js'
import { updateHotel } from './hotelController.js'

export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid
    const newRoom = new Room(req.body)

    try {
        const savedRoom = await newRoom.save()
        try {
            await Hotel.findByIdAndUpdate(hotelId, {$push: {rooms: savedRoom._id}})
        } catch (error) {
            next(error)
        }
        res.status(200).json(savedRoom)
    } catch (error) {
        next(error)
    }
}

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}) // <new: true> used to get updated value else it return the the previous value after the update
        res.status(200).json(updatedRoom)
    } catch (error) {
        next(error)
    }
}

export const updateRoomAvailability = async (req, res, next) => {
    try {
        await Room.updateOne(
            {"roomNumbers._id": req.params.id}, 
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
                }
            }
        )
        res.status(200).json("Room status has been updated.")
    } catch (error) {
        next(error)
    }
}

export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid
    try {
        await Room.findByIdAndDelete(req.params.id)
        try {
            await Hotel.findByIdAndUpdate(hotelId, {$pull: {rooms: req.params.id}})
        } catch (error) {
            next(error)
        }
        res.status(200).json("Room has been Deleted")
    } catch (error) {
        next(error)
    }
}

export const getRoom = async (req, res, next) => {
    try {
        const getRoom = await Room.findById(req.params.id)
        res.status(200).json(getRoom)
    } catch (error) {
        next(error)
    }
}

export const getAllRooms = async (req, res, next) => {
    try {
        const geAllRooms = await Room.find()
        res.status(200).json(geAllRooms)
    } catch (error) {
        next(error)
    }
}