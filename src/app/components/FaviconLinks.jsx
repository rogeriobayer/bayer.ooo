const faviconLinks = [
  {
    href: "/favicon-frames/loop-000.png",
    type: "image/png",
    "data-animated-favicon": "",
  },
];

export function FaviconLinks() {
  return faviconLinks.map((favicon) => (
    <link key={favicon.href} rel="icon" {...favicon} />
  ));
}

export default FaviconLinks;
