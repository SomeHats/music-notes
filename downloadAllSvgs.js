const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const scale = 3;

async function downloadAllSvgs() {
  const elements = Array.from(document.querySelectorAll("[data-dl-svg]"))
    .map(parent => ({
      name: parent.getAttribute("data-dl-svg"),
      svg: parent.querySelector("svg")
    }))
    .filter(({ svg }) => !!svg);

  for (const { name, svg } of elements) {
    svg.setAttribute("viewBox", `0 0 ${svg.clientWidth} ${svg.clientHeight}`);
    svg.setAttribute("version", "1.1");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      svg.outerHTML
    )}`;

    const img = document.createElement("img");
    img.addEventListener("load", () => {
      document.body.removeChild(img);

      const canvas = document.createElement("canvas");
      canvas.width = scale * svg.clientWidth;
      canvas.height = scale * svg.clientHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const url = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = url;
      link.click();
    });

    document.body.appendChild(img);
    img.src = svgUrl;

    await delay(100);
  }
}

export default downloadAllSvgs;
