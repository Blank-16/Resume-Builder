import jwt from 'jsonwebtoken'
import configs from '../configs/config.js'

const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, configs.jwtKey)
        req.userId = decoded.userId
        next()

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export default protect