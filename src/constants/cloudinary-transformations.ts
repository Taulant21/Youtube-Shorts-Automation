import { CloudinaryVideo, Transformation } from "@cloudinary/url-gen";
import { blur } from "@cloudinary/url-gen/actions/effect";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { video } from "@cloudinary/url-gen/qualifiers/source";
import ENV from "./env-vars";
import {
  compass,
} from "@cloudinary/url-gen/qualifiers/gravity";
import { Position } from "@cloudinary/url-gen/qualifiers";

export const getCameraRoundedURL = ({
  cldVideoPublicID,
  position,
}: {
  cldVideoPublicID: string;
  position: any;
}) => {
  let cldVideoURL = "";

  if (position === "none") {
    cldVideoURL = new CloudinaryVideo(cldVideoPublicID, {
      cloudName: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    })
      .effect(blur().strength(500))
      .resize(fill().width(1080).height(1920))
      .overlay(
        source(
          video(cldVideoPublicID).transformation(
            new Transformation().resize(fill().width(1080))
          )
        )
      )
      .toURL();
  } else {
    cldVideoURL = new CloudinaryVideo(cldVideoPublicID, {
      cloudName: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    })
      .effect(blur().strength(500))
      .resize(fill().width(1080).height(1920))
      .overlay(
        source(
          video(cldVideoPublicID).transformation(
            new Transformation().resize(fill().height(750))
          )
        ).position(new Position().gravity(compass(position)))
      )
      .toURL();
  }

  return cldVideoURL;
};
