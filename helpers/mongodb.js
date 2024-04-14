const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  })
  .catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection is established.')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})