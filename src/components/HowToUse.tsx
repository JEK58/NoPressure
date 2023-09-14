const HowToUse = () => {
  return (
    <div className="mt-2 max-w-3xl rounded-xl bg-white/10 p-4 text-white">
      <h3 className="text-lg font-semibold">How to Use</h3>
      <p className="mt-2 text-gray-300">
        Pick a platform, comp and pilot and copy the generated URL. In XCTrack
        or Alfapilot look for the &quot;website widget&quot; (at the bottom of
        the list) and paste the URL. <br />
        Flyevent or PWC comps will also appear in the Flymaster groups but
        without respecting leading points and no live score. So only use the
        flymaster group if it&apos;s not available on the other platforms.
      </p>
      <h4 className="mt-3 text-lg font-semibold">Limitations</h4>

      <ul className="ml-3 mt-3 list-outside list-disc text-gray-300">
        <li>This is a beta. Feel free to report any issues!</li>
        <li>
          Some events may not appear before the first task is started or live
          scoring is running. But if you have close a look at the generated URLs
          you could always manually create your personal URL if you know your
          pilot number and the comp id.
        </li>
        <li>
          With the recent changes in the PWC some adjustements may be needed
          during the event and the widget might not work at all times.
        </li>
      </ul>
    </div>
  );
};

export default HowToUse;
