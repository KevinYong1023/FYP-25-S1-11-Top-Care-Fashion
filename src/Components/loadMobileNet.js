import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

let cachedModel = null;

export const loadMobileNetModel = async () => {
  if (cachedModel) {
    return cachedModel; // return already-loaded model
  }

  await tf.ready(); // make sure TensorFlow is ready

  try {
    cachedModel = await mobilenet.load(); // load model once
    //console.log("MobileNet model loaded and cached.");
    return cachedModel;
  } catch (err) {
    console.error("Failed to load MobileNet model:", err);
    throw err;
  }
};