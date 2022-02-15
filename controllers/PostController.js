"use strict";

/**
 * @api {get} /posts Posts List
 * @apiName GetPost
 * @apiGroup Post
 * @apiDescription Get list of all posts
 * @apiQuery {number} limit=10 limit number of records
 * @apiQuery {number} page=1 current page number
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 200 OK
 * {
 *   message: "Posts fetched successfully.",
 *   data: [{
 *     title: "John",
 *     shortDescription: "Doe",
 *     slug: "john.doe@example.email"
 *     description: "active"
 *   }],
 *}
 * @apiError (Error 500) {string} message error message
 * @apiError (Error 500) {string} error error stack
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "We are having some error while completing your request. Please try again after some time."
 *   "error": actual error stack
 * }
 */
const index = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};
/**
 * Create a record
 * @param { req, res }
 * @returns JsonResponse
 */
const store = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data saved successfully.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

/**
 * Get only single record
 * @param { req, res }
 * @returns JsonResponse
 */
const details = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Details fetched successfully.",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

/**
 * update a record
 * @param { req, res }
 * @returns JsonResponse
 */
const update = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data updated successfully.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};
/**
 * Destroy a record
 * @param { req, res }
 * @returns JsonResponse
 */
const destroy = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data deleted successfully.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

/**
 * Export as a single common js module
 */
module.exports = {
  index,
  store,
  details,
  update,
  destroy,
};
