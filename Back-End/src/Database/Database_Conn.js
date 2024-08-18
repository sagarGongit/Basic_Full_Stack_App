import mongoose from 'mongoose'

const Database_Conn =async() => {
 try {
    await mongoose.connect(process.env.DATABASE_URI)
    console.log('connection established');
 } catch (error) {
    console.log(error)
 }
}

export default Database_Conn
