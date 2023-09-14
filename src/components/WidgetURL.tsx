import { useState } from "react";
interface Props {
  url: string;
}

const WidgetURL = (props: Props) => {
  const [useBlindmode, setUseBlindMode] = useState(false);

  const toggleBlindmode = () => setUseBlindMode(!useBlindmode);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error("Failed to copy: ", error);
    });
  };

  const url = props.url + (useBlindmode ? "/iamold" : "");

  return (
    <>
      <h3 className="mt-2 text-lg font-semibold">Widget URL</h3>

      <div className="mt-3 flex items-center">
        <input
          id="urlInput"
          type="text"
          value={url}
          className="mr-2 w-full rounded-lg border border-gray-300 bg-white p-2 text-black"
          readOnly
        />
        <button
          onClick={() => copyToClipboard(url)}
          className="focus:ring-[hsl(342,100%,30%) ] rounded-lg bg-[hsl(342,100%,70%)] px-4 py-2 text-white hover:bg-[hsl(342,100%,50%)] focus:outline-none  focus:ring"
        >
          Copy
        </button>
      </div>
      <div className="mt-4">
        <label htmlFor="checkbox" className="flex items-center">
          <input
            id="checkbox"
            type="checkbox"
            checked={useBlindmode}
            onChange={toggleBlindmode}
            className="mr-2 h-6 w-6 rounded-md border-2 border-[hsl(342,100%,70%)] text-[hsl(342,100%,70%)]"
          />
          <span>Check this if the widget is to small for your eyes</span>
        </label>
      </div>
    </>
  );
};

export default WidgetURL;
