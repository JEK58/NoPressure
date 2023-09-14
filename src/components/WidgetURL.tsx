interface Props {
  url: string;
}

const WidgetURL = (props: Props) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error("Failed to copy: ", error);
    });
  };

  return (
    <>
      <h3 className="mt-2 text-lg font-semibold">Widget URL</h3>

      <div className="mt-3 flex items-center">
        <input
          id="urlInput"
          type="text"
          value={props.url}
          className="mr-2 w-full rounded-lg border border-gray-300 bg-white p-2 text-black"
          readOnly
        />
        <button
          onClick={() => copyToClipboard(props.url)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
        >
          Copy
        </button>
      </div>
    </>
  );
};

export default WidgetURL;
