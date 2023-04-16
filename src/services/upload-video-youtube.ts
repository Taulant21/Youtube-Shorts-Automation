import axios from "axios";

export async function uploadVideoYotube({ clip, videoLink, setLoader }: any) {
  const response = await axios.post(
    "http://localhost:3001/videos/youtube/upload",
    { clip, editedVideoLink: videoLink }
  );
  if(response.status === 200) {
    setLoader(false)
  }

}
