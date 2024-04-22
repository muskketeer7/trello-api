import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { BOARD_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 chars',
      'string.max': 'Title maximum must be at least 50 chars',
      'string.trim': 'Title must not hvae leading or trailing whitespace',
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(200)
      .trim()
      .strict()
      .messages({
        'any.required': 'Description is required',
        'string.empty': 'Description is not allowed to be empty',
        'string.min': 'Description length must be at least 3 chars',
        'string.max': 'Description maximum must be at least 50 chars',
        'string.trim':
          'Description must not hvae leading or trailing whitespace',
      }),
    type: Joi.string()
      .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
      .required(),
  })

  try {
    // chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả các lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang controller
    next()
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: new Error(error).message })
  }
}

export const boardValidation = {
  createNew,
}
