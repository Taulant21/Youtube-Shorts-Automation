import { getTwitchClipID } from "@/utils/get-twitch-clip-id";
import { Clip, ClipURL } from "@/types";
import { useState } from "react";
import { getClipSourceURL } from "@/services/get-clip-source-url";
import { Loader } from "./shared/Loader";

type Props = {
  // eslint-disable-next-line no-unused-vars
  onClip: (clip: Clip) => void;
};

export function ClipInput({ onClip }: Props) {
  const [rawClipURL, setRawClipURL] = useState<ClipURL>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const clipID = getTwitchClipID({ clipURL: rawClipURL });

    if (!clipID) {
      setLoading(false);
      return setError("Invalid Twitch clip URL");
    }

    const clipURLResponse = await getClipSourceURL({
      clipID,
    });

    if (!clipURLResponse.ok) {
      setLoading(false);
      return setError(clipURLResponse.error);
    }

    const { id, url, broadcasterName, clipTitle } = clipURLResponse.data;
    setLoading(false);
    onClip({ url, id, broadcasterName, clipTitle});
    setRawClipURL("");
    setError(null);
  };

  const handleRawClipURLInputChange = (e: any) => {
    const newRawClipURL = e.target?.value?.trim();

    setError(null);
    setRawClipURL(newRawClipURL);
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-md mx-auto">
      <form
        className="flex flex-col justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <label htmlFor="clipUrl" className="text-xl font-bold mb-2">
          Your Twitch clip URL
        </label>
        <div className="flex justify-start items-center">
          <input
            autoComplete="off"
            list="demo-clips-list"
            required
            minLength={10}
            type="text"
            name="clipUrl"
            id="clipUrl"
            value={rawClipURL}
            onChange={handleRawClipURLInputChange}
            className="bg-gray-800 text-white px-3 py-2 rounded-md w-full"
            placeholder="https://www.twitch.tv/user/clip"
          />
          <button
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-500 hover:to-blue-600 text-white font-bold rounded-br-full rounded-tr-full duration-300 ease-in-out rotate-gradient hover:no-underline hover:shadow-2xl min-w-fit flex gap-2 items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 hover:scale-110 transition-transform relative z-10 overflow-hidden group"
          >
            <span className="absolute -rotate-45 scale-150 -z-10 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500 top-0 left-0 right-0 h-2/4 bg-gradient-to-t from-white to-transparent opacity-50"></span>
            {loading ? (
              <Loader />
            ) : (
              <>
                <span className="min-w-fit">Clip It</span>{" "}
                <svg
                  className="w-4"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                </svg>
              </>
            )}
          </button>
        </div>
        {error && <p className="text-red-400">{error}</p>}
      </form>
    </div>
  );
}
