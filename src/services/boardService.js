import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { slugify } from '~/utils/formatters'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    }

    const createBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(
      createBoard.insertedId.toString(),
    )
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Deep Clone board ra mot cai moi de xu ly, khong anh huong toi board ban dau, tuy much dich ve sau ma co can clone deep hay khong
    const resBoard = cloneDeep(board)

    // Dua card ve dung column cua no
    resBoard.columns.forEach((column) => {
      // Cach dung .equals nay la boi vi chung ta hieu objectId trong MongoDB cos support method .equals
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id),
      )

      // Convert objectId ve string bang ham toString() cua javascript
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString(),
      // )
    })

    // Remove cards from original board
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
}
