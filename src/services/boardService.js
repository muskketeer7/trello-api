import { boardModel } from '~/models/boardModel'
import { slugify } from '~/utils/formatters'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    console.log('getNewBoard', getNewBoard)
    return getNewBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
