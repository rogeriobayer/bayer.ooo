const faviconLinks = [
  {
    href: "/favicon-original.png",
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
