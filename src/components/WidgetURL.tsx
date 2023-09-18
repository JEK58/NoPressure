import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
interface Props {
  url: string;
}

const WidgetURL = (props: Props) => {
  const [useBlindmode, setUseBlindMode] = useState(false);
  const [feedback, setFeedback] = useState(false);

  const toggleBlindmode = () => setUseBlindMode(!useBlindmode);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error("Failed to copy: ", error);
    });
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2000);
  };

  const url = props.url + (useBlindmode ? "/iamold" : "");

  return (
    <>
      {/* Divider */}
      <div className="divider mt-7 px-1  before:bg-base-300 after:bg-base-300">
        <BiCheck className="text-5xl text-secondary" />
      </div>

      <h3 className="mt-3 text-lg font-semibold">Widget URL</h3>

      <div className="mt-2 flex items-center">
        <input
          id="urlInput"
          type="text"
          value={url}
          className="mr-2 w-full rounded-lg border border-gray-300 bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-secondary"
          readOnly
        />
        <button
          onClick={() => copyToClipboard(url)}
          className="focus:ring-[hsl(342,100%,30%) ] flex h-10 w-20 items-center justify-center rounded-lg bg-[hsl(342,100%,70%)]  px-4 py-2 text-white hover:bg-[hsl(342,100%,50%)] focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          {feedback ? <BsCheck2Circle className="text-xl" /> : "Copy"}
        </button>
      </div>
      <div className="mt-4">
        <div className="form-control  w-96">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-secondary"
              checked={useBlindmode}
              onChange={toggleBlindmode}
            />
            <span className="label-text text-white">
              Check this if the widget is too small for your eyes
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

export default WidgetURL;
