const config = {
    mongodbURI : String(process.env.MONGODB_URI),
    jwtKey : String(process.env.JWT_KEY),
    imageKitPrivateKey : String(process.env.IMAGEKIT_PRIVATE_KEY),
    openaiApiKey: String(process.env.OPENAI_KEY),
    openaiBaseUrl: String(process.env.OPENAI_BASE_URL),
    openaiModel : String(process.env.OPENAI_MODEL)
}

export default config