import { ClipInput } from "@/components/ClipInput";
import { Hero } from "@/components/Hero";
import { SemanticHead } from "@/components/SemanticHead";
import { Loader } from "@/components/shared/Loader";
import { VideoCropper } from "@/components/VideoCropper";
import { getCameraRoundedURL } from "@/constants/cloudinary-transformations";
import { uploadVideo } from "@/services/upload-video";
import { uploadVideoYotube } from "@/services/upload-video-youtube";
import { Clip, ClipURL, VideoConfig } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [clip, setClip] = useState<Clip>({
    url: "",
    id: "",
    broadcasterName: "",
    clipTitle: "",
  });
  const [videoConfig, setVideoConfig] = useState<VideoConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clipPublicID, setClipPublicID] = useState<string | null>(null);
  const lastClipURL = useRef<ClipURL>("");
  const [finalLink, setFinalLink] = useState("");
  const [loader, setLoader] = useState(true);

  const [position, setPosition] = useState("none");

  useEffect(() => {
    const handleUploadVideo = async () => {
      const videoResponse = await uploadVideo({
        videoURL: clip.url,
        videoID: clip.id,
      });
      if (!videoResponse.ok) return setError(videoResponse.error);

      const cldVideoPublicID = videoResponse.data.uploadedVideoPublicID;
      setClipPublicID(cldVideoPublicID);
    };

    const trimmedClipURL = clip.url.trim();

    if (trimmedClipURL && trimmedClipURL !== lastClipURL.current?.trim()) {
      handleUploadVideo();
      setVideoConfig(null);
      lastClipURL.current = trimmedClipURL;
    }
  }, [clip]);

  const getFinalLink = ({ clipPublicID }: any) => {
    const finalVideoLink = getCameraRoundedURL({
      cldVideoPublicID: clipPublicID,
      position
    });

    return finalVideoLink;
  };

  useEffect(() => {
    if (clipPublicID !== null) {
      const link = getFinalLink({ clipPublicID, videoConfig });
      setFinalLink(link);
    }
  }, [clipPublicID]);

  useEffect(() => {
    const finalStep = async () => {
      await uploadVideoYotube({clip, videoLink: finalLink, setLoader})
    }

    if(finalLink !== '') {
      finalStep()
    }
  }, [finalLink, clip])

  console.log(finalLink);

  const handleOnVideoConfig = (config: VideoConfig) => {
    setVideoConfig(config);
  };
  // Basically added a check so if loader is true which always is and then is finalLink isn't blank then refresh
  useEffect(() => {
     
    if (!loader && finalLink !=="") {
      window.location.reload()
    }
     
  },[finalLink, loader]);

  return (
    <>
      <SemanticHead description="" title="Clippitt" />
      <main className="flex flex-col justify-center items-center">
        <>
          <section className="max-w-4xl mx-auto">
            <Hero />

            <ClipInput onClip={(clip) => setClip(clip)} />
          </section>

          {clip.id && clip.url && (
            <div className="collapse">
              <VideoCropper
                onVideoConfig={handleOnVideoConfig}
                videoSrc={clip.url}
              />
            </div>
          )}
          <div className="w-1/2 mt-12 flex justify-between">
            <button onClick={() => setPosition("west")}>Left Position</button>
           <div className="PositionText">{`Position of video is: ${position}`}</div>
            <button onClick={() => setPosition("east")}>Right Position</button>
          </div>
          {finalLink !== "" && (
            <div className="mt-5">{loader ? <Loader /> : "Done!"}</div>
          )}
          {error && console.log(`ERROR: ${error}`)}
        </>
      </main>
    </>
  );
}