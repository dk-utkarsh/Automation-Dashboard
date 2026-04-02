export default function IframeViewer({ url, title }) {
  return (
    <iframe
      src={url}
      title={title}
      className="w-full border-0"
      style={{ height: "calc(100vh - 120px)" }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
  );
}
