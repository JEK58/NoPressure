const HowToUse = () => {
  return (
    <div className="mt-1 max-w-2xl rounded-xl bg-white/10 p-4 text-white">
      <p className="mb-3 text-gray-200">
        <span className="font-semibold">⚠️</span> Flymaster doesn&apos;t
        currently work. I&apos;m working on it.
      </p>

      <p className="mb-3 text-gray-200">
        <span className="font-semibold">🚀 New:</span> Using PWC in the dropdown
        will now show the live leading points instead of total score.
      </p>
      <h3 className="text-lg font-semibold">How to use</h3>

      <ul className="ml-4 mt-3 list-outside list-disc text-gray-200">
        <li>Pick a platform, comp and pilot and copy the generated URL.</li>
        <li>
          In XCTrack or Alfapilot look for the &quot;website widget&quot; (at
          the bottom of the list) and paste the URL.
        </li>
      </ul>
      <p className="mt-2 text-gray-200">
        The widget will refresh every minute in the background. No need to set a
        refresh rate in the widget options. If the position data is older than 3
        minutes (e.g. bad connection in the air) the digits turn red.
        <br />
        Flyevent or PWC comps will also appear in the Flymaster groups but
        without respecting leading points* and no live score. So only use the
        flymaster group if a comp is not available on the other platforms.
      </p>
      <h4 className="mt-3 text-lg font-semibold">Limitations</h4>

      <ul className="ml-4 mt-3 list-outside list-disc text-gray-200">
        <li>This is a beta. Feel free to report any issues or suggestions!</li>
        <li>
          Some events may not appear before the first task is started or live
          scoring is running. But if you have a close look at the generated URLs
          you could always manually create your personal URL if you know your
          pilot number and the comp id.
        </li>
        <li>Flymaster groups have a 4 minute delay.</li>
        <li>
          With the recent changes in the PWC some adjustements may be needed
          during the event and the widget might not work at all times.
        </li>
      </ul>
      <p className="mt-4 text-sm text-gray-200">
        * except for PWC events where leading points are now respected in the
        flymaster ranking.
      </p>
    </div>
  );
};

export default HowToUse;
