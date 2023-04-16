import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { VideoConfig } from "@/types";

type Props = {
  videoSrc: string;
  // eslint-disable-next-line no-unused-vars
  onVideoConfig: (config: VideoConfig) => void;
};

export function VideoCropper({ videoSrc, onVideoConfig }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [finalVideoConfig, setFinalVideoConfig] = useState<VideoConfig>({
    camera: { coords: { x: 0, y: 0 }, size: { width: 0, height: 0 } },
    content: { coords: { x: 0, y: 0 }, size: { width: 0, height: 0 } },
  });

  useEffect(() => {
    onVideoConfig(finalVideoConfig);
  }, [onVideoConfig, finalVideoConfig]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      const { height, width, x, y } = croppedAreaPixels;

      const cameraConfig = {
        coords: {
          x,
          y,
        },
        size: {
          height,
          width,
        },
      };

      const contentConfig = {
        coords: {
          x,
          y,
        },
        size: {
          height,
          width,
        },
      };
      setFinalVideoConfig((currentConfig) => ({
        ...currentConfig,
        camera: cameraConfig,
        content: contentConfig,
      }));
    },
    []
  );
  return (
    <Cropper
      video={videoSrc}
      crop={crop}
      aspect={9 / 16}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
    />
  );
}
