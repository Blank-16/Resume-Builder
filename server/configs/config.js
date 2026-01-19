const config = {
    mongodbURI : String(process.env.MONGODB_URI),
    jwtKey : String(process.env.JWT_KEY),
    imageKitPrivateKey : String(process.env.IMAGEKIT_PRIVATE_KEY)
}

export default config