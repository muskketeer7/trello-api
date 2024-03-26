/* eslint-disable no-console */

import existHook from 'async-exit-hook'
import express from 'express'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'

const START_SERVER = () => {
  const app = express()

  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Hello ${env.AUTHOR}, Back-end Server is running at HOST: ${env.APP_HOST} and Port: ${env.APP_PORT}/`
    )
  })

  // Thực hiện các tác vụ cleanup trước khi dừng server
  existHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected to MongoDB Cloud Atlas!')
  })
}

// Chỉ khi kết nối tới DB thành công thì mới Start Server Back-end lên.
// Immediately-invoked / Anonymous Async Functions (IIFE)
;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas!')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')

    // Khởi động Server Back-end sau khi Connect DB thành công
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// console.log('1. Connecting to MongoDB Cloud Atlas!')

// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.log(error)
//     process.exit(0)
//   })
