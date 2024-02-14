import httpStatus from "http-status";
const mediaInput = require("../middlewares/mediaInput");
import catchAsync from "../utils/catchAsync";
import { authService, userService } from "../services";
import ApiError from "../utils/ApiError";
const s3Service = require("../services/s3.service");

export const uploadImages = catchAsync(async (req, res) => {
  if (req.params.id !== req.user.id) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorised to perform this action"
    );
  }
  if (req.files?.images) {
    let images = [];
    console.log("images array", req.files.images);
    for (let i = 0; i < req.files?.images.length; i++) {
      console.log("buffer", req.files.images[i]);
      let fileName = mediaInput.randomImageName();
      let response = await s3Service.uploadFile(req.files.images[i], fileName);
      console.log("Response from s3", response);
      images.push(fileName);
      console.log("images image", images);
    }
    console.log("Final images allotment", images);
    req.body.images = images;
    const updateBody = await userService.updateUserById(
      req.params.id,
      req.body
    );
    res.status(httpStatus.OK).send({ user: updateBody });
  } else {
    res.status(httpStatus.BAD_REQUEST).send("No Image Provided");
  }
});

export const updateUser = catchAsync(async (req, res) => {
  console.log("Reqeust vbody", req.body);
  if (req.params.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Method not allowed");
  }

  if (req.body.password) {
    const updatePassword = await authService.updateUserPassword(
      req.params.id,
      req.body.password
    );
  }
  const userUpdated = await userService.updateUserById(req.params.id, req.body);
  console.log("user updated", userUpdated);

  res.status(httpStatus.OK).send({ user: userUpdated });
});

const searchAndFilterImage = async (key, id) => {
  const user = await userService.getUserById(id);
  let updatedArr = user.images;
  if (user.images.includes(key)) {
    updatedArr = user?.images.filter((imgKey) => imgKey !== key);
    console.log("Iupdate", updatedArr);
  }
  return updatedArr;
};

export const deleteImage = catchAsync(async (req, res) => {
  if (req.params.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Method not allowed");
  }

  const { imageKey } = req.body;
  const deleteResponse = await s3Service.deleteFile(imageKey);

  const newImagesArr = await searchAndFilterImage(imageKey, req.params.id);
  console.log("IMage", newImagesArr);
  const userUpdated = await userService.updateUserById(req.params.id, {
    images: newImagesArr,
  });
  console.log("user updated", userUpdated);

  res.status(httpStatus.OK).send({ user: userUpdated });
});

export const getUserById = catchAsync(async (req, res) => {
  if (req.params.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Method not allowed");
  }
  let user = await userService.getUserById(req.params.id);
  let imgArr = [];
  if (user?.images?.length > 0) {
    let img = user.images;

    for (let i = 0; i < img.length; i++) {
      let imgLink: string = await s3Service.getMediaUrl(img[i]);
      if (imgLink) imgArr.push(imgLink);
    }
  }

  res.status(httpStatus.OK).send({ user, imgUrls: imgArr });
});
